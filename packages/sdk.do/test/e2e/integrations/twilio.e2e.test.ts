/**
 * Twilio Integration E2E Tests
 *
 * End-to-end tests for Twilio API integration.
 * Tests cover SMS, voice calls, phone numbers, verify, conferences, recordings, and webhooks.
 *
 * Prerequisites:
 * - TWILIO_ACCOUNT_SID environment variable must be set
 * - TWILIO_AUTH_TOKEN environment variable must be set
 * - TWILIO_PHONE_NUMBER environment variable (your Twilio phone number)
 * - TWILIO_TEST_TO_NUMBER environment variable (phone number to send test messages/calls to)
 * - Twilio account with sufficient credits for testing
 *
 * Test Categories:
 * 1. SMS Operations (7 tests)
 * 2. Voice Call Operations (6 tests)
 * 3. Phone Number Operations (4 tests)
 * 4. Verify Operations (2 tests)
 * 5. Conference Operations (3 tests)
 * 6. Recording Operations (2 tests)
 * 7. Webhook Handling (1 test)
 * 8. Error Handling (1 test)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import crypto from 'crypto'

describe('Twilio Integration E2E Tests', () => {
  let runner: E2ETestRunner
  let accountSid: string
  let authToken: string
  let fromNumber: string
  let toNumber: string

  // Resource tracking for cleanup
  let createdMessages: string[] = []
  let createdCalls: string[] = []
  let purchasedPhoneNumbers: string[] = []

  beforeEach(async () => {
    runner = new E2ETestRunner('twilio')

    // Check for required credentials
    if (!process.env.TWILIO_ACCOUNT_SID) {
      throw new Error('TWILIO_ACCOUNT_SID environment variable is required for Twilio E2E tests')
    }

    if (!process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('TWILIO_AUTH_TOKEN environment variable is required for Twilio E2E tests')
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('TWILIO_PHONE_NUMBER environment variable is required for Twilio E2E tests')
    }

    if (!process.env.TWILIO_TEST_TO_NUMBER) {
      throw new Error('TWILIO_TEST_TO_NUMBER environment variable is required for Twilio E2E tests')
    }

    accountSid = process.env.TWILIO_ACCOUNT_SID
    authToken = process.env.TWILIO_AUTH_TOKEN
    fromNumber = process.env.TWILIO_PHONE_NUMBER
    toNumber = process.env.TWILIO_TEST_TO_NUMBER

    // Reset tracking arrays
    createdMessages = []
    createdCalls = []
    purchasedPhoneNumbers = []
  })

  afterEach(async () => {
    const sdk = runner.getSDK()

    // Clean up messages (note: SMS messages cannot be deleted via API, only listed)
    // Messages will expire from Twilio's system automatically

    // Clean up active calls (hangup any in-progress calls)
    for (const callSid of createdCalls) {
      try {
        await sdk.api.twilio.calls.update(callSid, {
          status: 'completed',
        })
      } catch (error) {
        console.warn(`Failed to hangup call ${callSid}:`, error)
      }
    }

    // Clean up purchased phone numbers
    for (const phoneNumber of purchasedPhoneNumbers) {
      try {
        await sdk.api.twilio.phoneNumbers.release(phoneNumber)
      } catch (error) {
        console.warn(`Failed to release phone number ${phoneNumber}:`, error)
      }
    }

    await runner.teardown()
  })

  // =============================================================================
  // 1. SMS Operations (7 tests)
  // =============================================================================

  test(
    'should send SMS message',
    async () => {
      const sdk = runner.getSDK()
      const messageBody = `E2E Test SMS: ${runner.testId}`

      // Send SMS
      const message = await sdk.api.twilio.messages.create({
        from: fromNumber,
        to: toNumber,
        body: messageBody,
      })

      expect(message).toBeDefined()
      expect(message.sid).toBeTruthy()
      expect(message.sid).toMatch(/^SM[a-f0-9]{32}$/)
      expect(message.from).toBe(fromNumber)
      expect(message.to).toBe(toNumber)
      expect(message.body).toBe(messageBody)
      expect(message.status).toMatch(/queued|sending|sent/)
      expect(message.direction).toBe('outbound-api')

      // Track for reference
      createdMessages.push(message.sid)
    },
    getTimeout()
  )

  test(
    'should get SMS message by SID',
    async () => {
      const sdk = runner.getSDK()

      // Send message first
      const sent = await sdk.api.twilio.messages.create({
        from: fromNumber,
        to: toNumber,
        body: `Test message for retrieval: ${runner.testId}`,
      })

      expect(sent.sid).toBeTruthy()
      createdMessages.push(sent.sid)

      // Wait a moment for message to be processed
      await runner.wait(2000)

      // Retrieve message
      const retrieved = await sdk.api.twilio.messages.get(sent.sid)

      expect(retrieved).toBeDefined()
      expect(retrieved.sid).toBe(sent.sid)
      expect(retrieved.from).toBe(fromNumber)
      expect(retrieved.to).toBe(toNumber)
      expect(retrieved.body).toContain(runner.testId)
      expect(retrieved.dateCreated).toBeTruthy()
      expect(retrieved.dateSent).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should list SMS messages',
    async () => {
      const sdk = runner.getSDK()

      // Send a test message to ensure we have messages
      const sent = await sdk.api.twilio.messages.create({
        from: fromNumber,
        to: toNumber,
        body: `List test: ${runner.testId}`,
      })

      createdMessages.push(sent.sid)

      // Wait for message to be indexed
      await runner.wait(2000)

      // List messages
      const messages = await sdk.api.twilio.messages.list({
        from: fromNumber,
        limit: 20,
      })

      expect(messages).toBeDefined()
      expect(Array.isArray(messages)).toBe(true)
      expect(messages.length).toBeGreaterThan(0)

      // Verify message structure
      const message = messages[0]
      expect(message.sid).toBeTruthy()
      expect(message.from).toBeTruthy()
      expect(message.to).toBeTruthy()
      expect(message.body).toBeTruthy()
      expect(message.status).toBeTruthy()

      // Find our test message
      const testMessage = messages.find((m) => m.sid === sent.sid)
      expect(testMessage).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should delete SMS message',
    async () => {
      const sdk = runner.getSDK()

      // Send message
      const sent = await sdk.api.twilio.messages.create({
        from: fromNumber,
        to: toNumber,
        body: `Message to delete: ${runner.testId}`,
      })

      expect(sent.sid).toBeTruthy()

      // Wait for message to be processed
      await runner.wait(2000)

      // Delete message
      const deleted = await sdk.api.twilio.messages.delete(sent.sid)

      expect(deleted).toBe(true)

      // Verify message is deleted (should throw 404)
      await expect(sdk.api.twilio.messages.get(sent.sid)).rejects.toThrow()
    },
    getTimeout()
  )

  test(
    'should send SMS with media (MMS)',
    async () => {
      const sdk = runner.getSDK()

      // Send MMS with media URL
      const message = await sdk.api.twilio.messages.create({
        from: fromNumber,
        to: toNumber,
        body: `MMS test: ${runner.testId}`,
        mediaUrl: ['https://demo.twilio.com/owl.png'],
      })

      expect(message).toBeDefined()
      expect(message.sid).toBeTruthy()
      expect(message.body).toContain(runner.testId)
      expect(message.numMedia).toBe('1')
      expect(message.status).toMatch(/queued|sending|sent/)

      createdMessages.push(message.sid)

      // Wait and verify media was attached
      await runner.wait(2000)

      const retrieved = await sdk.api.twilio.messages.get(message.sid)
      expect(retrieved.numMedia).toBe('1')
    },
    getTimeout()
  )

  test(
    'should send SMS with messaging service',
    async () => {
      const sdk = runner.getSDK()

      // Note: This test requires a messaging service SID
      const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID

      if (!messagingServiceSid) {
        console.log('Skipping test: TWILIO_MESSAGING_SERVICE_SID not set')
        return
      }

      // Send SMS using messaging service
      const message = await sdk.api.twilio.messages.create({
        messagingServiceSid,
        to: toNumber,
        body: `Messaging service test: ${runner.testId}`,
      })

      expect(message).toBeDefined()
      expect(message.sid).toBeTruthy()
      expect(message.to).toBe(toNumber)
      expect(message.body).toContain(runner.testId)
      expect(message.messagingServiceSid).toBe(messagingServiceSid)

      createdMessages.push(message.sid)
    },
    getTimeout()
  )

  test(
    'should schedule SMS for later',
    async () => {
      const sdk = runner.getSDK()

      // Schedule message for 5 minutes from now
      const sendAt = new Date(Date.now() + 5 * 60 * 1000)

      // Send scheduled message
      const message = await sdk.api.twilio.messages.create({
        from: fromNumber,
        to: toNumber,
        body: `Scheduled message: ${runner.testId}`,
        scheduleType: 'fixed',
        sendAt: sendAt.toISOString(),
      })

      expect(message).toBeDefined()
      expect(message.sid).toBeTruthy()
      expect(message.status).toBe('scheduled')
      expect(message.sendAt).toBeTruthy()

      createdMessages.push(message.sid)

      // Cancel the scheduled message to avoid actual delivery
      await runner.wait(1000)
      const canceled = await sdk.api.twilio.messages.update(message.sid, {
        status: 'canceled',
      })

      expect(canceled.status).toBe('canceled')
    },
    getTimeout()
  )

  // =============================================================================
  // 2. Voice Call Operations (6 tests)
  // =============================================================================

  test(
    'should make outbound call',
    async () => {
      const sdk = runner.getSDK()

      // Make call with TwiML
      const call = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: '<Response><Say>This is an E2E test call. Goodbye.</Say></Response>',
      })

      expect(call).toBeDefined()
      expect(call.sid).toBeTruthy()
      expect(call.sid).toMatch(/^CA[a-f0-9]{32}$/)
      expect(call.from).toBe(fromNumber)
      expect(call.to).toBe(toNumber)
      expect(call.status).toMatch(/queued|ringing|in-progress/)
      expect(call.direction).toBe('outbound-api')

      createdCalls.push(call.sid)

      // Wait a moment then hang up to avoid long test duration
      await runner.wait(3000)

      await sdk.api.twilio.calls.update(call.sid, {
        status: 'completed',
      })
    },
    getTimeout()
  )

  test(
    'should get call details by SID',
    async () => {
      const sdk = runner.getSDK()

      // Create call
      const created = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: '<Response><Say>Retrieval test</Say></Response>',
      })

      expect(created.sid).toBeTruthy()
      createdCalls.push(created.sid)

      // Wait for call to be processed
      await runner.wait(2000)

      // Retrieve call details
      const retrieved = await sdk.api.twilio.calls.get(created.sid)

      expect(retrieved).toBeDefined()
      expect(retrieved.sid).toBe(created.sid)
      expect(retrieved.from).toBe(fromNumber)
      expect(retrieved.to).toBe(toNumber)
      expect(retrieved.status).toBeTruthy()
      expect(retrieved.duration).toBeDefined()
      expect(retrieved.dateCreated).toBeTruthy()

      // Hang up call
      await sdk.api.twilio.calls.update(created.sid, { status: 'completed' })
    },
    getTimeout()
  )

  test(
    'should list calls',
    async () => {
      const sdk = runner.getSDK()

      // Create a test call
      const call = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: '<Response><Say>List test</Say></Response>',
      })

      createdCalls.push(call.sid)

      // Wait for call to be indexed
      await runner.wait(2000)

      // List calls
      const calls = await sdk.api.twilio.calls.list({
        from: fromNumber,
        limit: 20,
      })

      expect(calls).toBeDefined()
      expect(Array.isArray(calls)).toBe(true)
      expect(calls.length).toBeGreaterThan(0)

      // Verify call structure
      const callItem = calls[0]
      expect(callItem.sid).toBeTruthy()
      expect(callItem.from).toBeTruthy()
      expect(callItem.to).toBeTruthy()
      expect(callItem.status).toBeTruthy()

      // Find our test call
      const testCall = calls.find((c) => c.sid === call.sid)
      expect(testCall).toBeDefined()

      // Hang up call
      await sdk.api.twilio.calls.update(call.sid, { status: 'completed' })
    },
    getTimeout()
  )

  test(
    'should update call in progress',
    async () => {
      const sdk = runner.getSDK()

      // Create call
      const call = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: '<Response><Say>Update test</Say></Response>',
      })

      expect(call.sid).toBeTruthy()
      createdCalls.push(call.sid)

      // Wait for call to start
      await runner.wait(3000)

      // Update call with new TwiML
      const updated = await sdk.api.twilio.calls.update(call.sid, {
        twiml: '<Response><Say>Call updated successfully</Say></Response>',
      })

      expect(updated).toBeDefined()
      expect(updated.sid).toBe(call.sid)

      // Hang up call
      await runner.wait(2000)
      await sdk.api.twilio.calls.update(call.sid, { status: 'completed' })
    },
    getTimeout()
  )

  test(
    'should create call with TwiML',
    async () => {
      const sdk = runner.getSDK()

      // Create call with inline TwiML
      const twiml = `
      <Response>
        <Say voice="alice">Hello from E2E test ${runner.testId}</Say>
        <Pause length="1"/>
        <Say>Goodbye</Say>
      </Response>
    `

      const call = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: twiml,
        timeout: 30,
        statusCallback: 'https://example.com/webhook/call-status',
        statusCallbackMethod: 'POST',
      })

      expect(call).toBeDefined()
      expect(call.sid).toBeTruthy()
      expect(call.from).toBe(fromNumber)
      expect(call.to).toBe(toNumber)

      createdCalls.push(call.sid)

      // Hang up after short duration
      await runner.wait(3000)
      await sdk.api.twilio.calls.update(call.sid, { status: 'completed' })
    },
    getTimeout()
  )

  test(
    'should hangup call',
    async () => {
      const sdk = runner.getSDK()

      // Create call
      const call = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: '<Response><Say>Hangup test</Say><Pause length="30"/></Response>',
      })

      expect(call.sid).toBeTruthy()

      // Wait for call to be in progress
      await runner.wait(3000)

      // Hang up the call
      const hungUp = await sdk.api.twilio.calls.update(call.sid, {
        status: 'completed',
      })

      expect(hungUp).toBeDefined()
      expect(hungUp.sid).toBe(call.sid)
      expect(hungUp.status).toMatch(/completed|canceled/)

      // Verify call is terminated
      await runner.wait(1000)
      const retrieved = await sdk.api.twilio.calls.get(call.sid)
      expect(retrieved.status).toMatch(/completed|canceled|busy|no-answer/)
    },
    getTimeout()
  )

  // =============================================================================
  // 3. Phone Number Operations (4 tests)
  // =============================================================================

  test(
    'should list available phone numbers',
    async () => {
      const sdk = runner.getSDK()

      // Search for available local phone numbers in US
      const availableNumbers = await sdk.api.twilio.phoneNumbers.availableLocal('US', {
        areaCode: '415',
        limit: 5,
      })

      expect(availableNumbers).toBeDefined()
      expect(Array.isArray(availableNumbers)).toBe(true)
      expect(availableNumbers.length).toBeGreaterThan(0)

      // Verify phone number structure
      const phoneNumber = availableNumbers[0]
      expect(phoneNumber.phoneNumber).toBeTruthy()
      expect(phoneNumber.friendlyName).toBeTruthy()
      expect(phoneNumber.capabilities).toBeDefined()
      expect(phoneNumber.capabilities.voice).toBeDefined()
      expect(phoneNumber.capabilities.SMS).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should buy phone number',
    async () => {
      const sdk = runner.getSDK()

      // Skip this test if we don't want to actually purchase numbers
      if (process.env.SKIP_PHONE_PURCHASE === 'true') {
        console.log('Skipping phone purchase test')
        return
      }

      // Search for available number
      const availableNumbers = await sdk.api.twilio.phoneNumbers.availableLocal('US', {
        limit: 1,
      })

      expect(availableNumbers.length).toBeGreaterThan(0)

      const numberToBuy = availableNumbers[0].phoneNumber

      // Purchase the phone number
      const purchased = await sdk.api.twilio.phoneNumbers.buy({
        phoneNumber: numberToBuy,
        friendlyName: `E2E Test - ${runner.testId}`,
      })

      expect(purchased).toBeDefined()
      expect(purchased.sid).toBeTruthy()
      expect(purchased.phoneNumber).toBe(numberToBuy)
      expect(purchased.friendlyName).toContain(runner.testId)

      // Track for cleanup
      purchasedPhoneNumbers.push(purchased.sid)
    },
    getTimeout()
  )

  test(
    'should get phone number details',
    async () => {
      const sdk = runner.getSDK()

      // Get details for our test phone number
      const phoneNumberSid = process.env.TWILIO_PHONE_NUMBER_SID

      if (!phoneNumberSid) {
        console.log('Skipping test: TWILIO_PHONE_NUMBER_SID not set')
        return
      }

      // Retrieve phone number details
      const phoneNumber = await sdk.api.twilio.phoneNumbers.get(phoneNumberSid)

      expect(phoneNumber).toBeDefined()
      expect(phoneNumber.sid).toBe(phoneNumberSid)
      expect(phoneNumber.phoneNumber).toBeTruthy()
      expect(phoneNumber.friendlyName).toBeTruthy()
      expect(phoneNumber.capabilities).toBeDefined()
      expect(phoneNumber.accountSid).toBe(accountSid)
    },
    getTimeout()
  )

  test(
    'should release phone number',
    async () => {
      const sdk = runner.getSDK()

      // Skip this test if we don't want to actually purchase/release numbers
      if (process.env.SKIP_PHONE_PURCHASE === 'true') {
        console.log('Skipping phone release test')
        return
      }

      // First, purchase a number to release
      const availableNumbers = await sdk.api.twilio.phoneNumbers.availableLocal('US', {
        limit: 1,
      })

      expect(availableNumbers.length).toBeGreaterThan(0)

      const purchased = await sdk.api.twilio.phoneNumbers.buy({
        phoneNumber: availableNumbers[0].phoneNumber,
        friendlyName: `E2E Test - Release - ${runner.testId}`,
      })

      expect(purchased.sid).toBeTruthy()

      // Wait a moment
      await runner.wait(2000)

      // Release the phone number
      const released = await sdk.api.twilio.phoneNumbers.release(purchased.sid)

      expect(released).toBe(true)

      // Verify number is released (should throw 404)
      await expect(sdk.api.twilio.phoneNumbers.get(purchased.sid)).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // 4. Verify Operations (2 tests)
  // =============================================================================

  test(
    'should send verification code',
    async () => {
      const sdk = runner.getSDK()

      // Note: Requires Twilio Verify service SID
      const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

      if (!verifyServiceSid) {
        console.log('Skipping test: TWILIO_VERIFY_SERVICE_SID not set')
        return
      }

      // Send verification code
      const verification = await sdk.api.twilio.verify.sendCode({
        serviceSid: verifyServiceSid,
        to: toNumber,
        channel: 'sms',
      })

      expect(verification).toBeDefined()
      expect(verification.sid).toBeTruthy()
      expect(verification.status).toBe('pending')
      expect(verification.to).toBe(toNumber)
      expect(verification.channel).toBe('sms')
      expect(verification.valid).toBe(false)
    },
    getTimeout()
  )

  test(
    'should check verification code',
    async () => {
      const sdk = runner.getSDK()

      // Note: Requires Twilio Verify service SID
      const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

      if (!verifyServiceSid) {
        console.log('Skipping test: TWILIO_VERIFY_SERVICE_SID not set')
        return
      }

      // Send verification code
      await sdk.api.twilio.verify.sendCode({
        serviceSid: verifyServiceSid,
        to: toNumber,
        channel: 'sms',
      })

      // Wait for code to be sent
      await runner.wait(3000)

      // Try to verify with incorrect code (will fail, but tests API)
      try {
        await sdk.api.twilio.verify.checkCode({
          serviceSid: verifyServiceSid,
          to: toNumber,
          code: '000000', // Incorrect code
        })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        // Expected to fail with incorrect code
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
      }
    },
    getTimeout()
  )

  // =============================================================================
  // 5. Conference Operations (3 tests)
  // =============================================================================

  test(
    'should create conference',
    async () => {
      const sdk = runner.getSDK()

      const conferenceName = `E2E Test Conference ${runner.testId}`

      // Create call that joins a conference
      const call = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: `
        <Response>
          <Say>Joining conference</Say>
          <Dial>
            <Conference>${conferenceName}</Conference>
          </Dial>
        </Response>
      `,
      })

      expect(call.sid).toBeTruthy()
      createdCalls.push(call.sid)

      // Wait for conference to be created
      await runner.wait(5000)

      // List conferences to find ours
      const conferences = await sdk.api.twilio.conferences.list({
        friendlyName: conferenceName,
        status: 'in-progress',
      })

      expect(conferences).toBeDefined()
      expect(Array.isArray(conferences)).toBe(true)

      // If conference was created, verify structure
      if (conferences.length > 0) {
        const conference = conferences[0]
        expect(conference.sid).toBeTruthy()
        expect(conference.friendlyName).toBe(conferenceName)
        expect(conference.status).toBe('in-progress')
      }

      // End the call to close conference
      await sdk.api.twilio.calls.update(call.sid, { status: 'completed' })
    },
    getTimeout()
  )

  test(
    'should list conference participants',
    async () => {
      const sdk = runner.getSDK()

      const conferenceName = `E2E Participants Test ${runner.testId}`

      // Create call that joins a conference
      const call = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: `
        <Response>
          <Dial>
            <Conference>${conferenceName}</Conference>
          </Dial>
        </Response>
      `,
      })

      createdCalls.push(call.sid)

      // Wait for conference to be created and call to join
      await runner.wait(5000)

      // List conferences
      const conferences = await sdk.api.twilio.conferences.list({
        friendlyName: conferenceName,
        status: 'in-progress',
      })

      if (conferences.length > 0) {
        const conferenceSid = conferences[0].sid

        // List participants in conference
        const participants = await sdk.api.twilio.conferences.listParticipants(conferenceSid)

        expect(participants).toBeDefined()
        expect(Array.isArray(participants)).toBe(true)

        // If participants exist, verify structure
        if (participants.length > 0) {
          const participant = participants[0]
          expect(participant.callSid).toBeTruthy()
          expect(participant.conferenceSid).toBe(conferenceSid)
          expect(participant.muted).toBeDefined()
          expect(participant.hold).toBeDefined()
        }
      }

      // End the call
      await sdk.api.twilio.calls.update(call.sid, { status: 'completed' })
    },
    getTimeout()
  )

  test(
    'should get conference details',
    async () => {
      const sdk = runner.getSDK()

      const conferenceName = `E2E Details Test ${runner.testId}`

      // Create call that joins a conference
      const call = await sdk.api.twilio.calls.create({
        from: fromNumber,
        to: toNumber,
        twiml: `
        <Response>
          <Dial>
            <Conference>${conferenceName}</Conference>
          </Dial>
        </Response>
      `,
      })

      createdCalls.push(call.sid)

      // Wait for conference to be created
      await runner.wait(5000)

      // List conferences to find ours
      const conferences = await sdk.api.twilio.conferences.list({
        friendlyName: conferenceName,
        status: 'in-progress',
      })

      if (conferences.length > 0) {
        const conferenceSid = conferences[0].sid

        // Get conference details
        const conference = await sdk.api.twilio.conferences.get(conferenceSid)

        expect(conference).toBeDefined()
        expect(conference.sid).toBe(conferenceSid)
        expect(conference.friendlyName).toBe(conferenceName)
        expect(conference.status).toBeTruthy()
        expect(conference.dateCreated).toBeTruthy()
      }

      // End the call
      await sdk.api.twilio.calls.update(call.sid, { status: 'completed' })
    },
    getTimeout()
  )

  // =============================================================================
  // 6. Recording Operations (2 tests)
  // =============================================================================

  test(
    'should list recordings',
    async () => {
      const sdk = runner.getSDK()

      // List recordings
      const recordings = await sdk.api.twilio.recordings.list({
        limit: 20,
      })

      expect(recordings).toBeDefined()
      expect(Array.isArray(recordings)).toBe(true)

      // If recordings exist, verify structure
      if (recordings.length > 0) {
        const recording = recordings[0]
        expect(recording.sid).toBeTruthy()
        expect(recording.sid).toMatch(/^RE[a-f0-9]{32}$/)
        expect(recording.callSid).toBeTruthy()
        expect(recording.duration).toBeDefined()
        expect(recording.status).toBeTruthy()
        expect(recording.dateCreated).toBeTruthy()
      }
    },
    getTimeout()
  )

  test(
    'should get recording details',
    async () => {
      const sdk = runner.getSDK()

      // First, list recordings to get a valid recording SID
      const recordings = await sdk.api.twilio.recordings.list({
        limit: 1,
      })

      if (recordings.length === 0) {
        console.log('Skipping test: No recordings available')
        return
      }

      const recordingSid = recordings[0].sid

      // Get recording details
      const recording = await sdk.api.twilio.recordings.get(recordingSid)

      expect(recording).toBeDefined()
      expect(recording.sid).toBe(recordingSid)
      expect(recording.callSid).toBeTruthy()
      expect(recording.duration).toBeDefined()
      expect(recording.status).toBeTruthy()
      expect(recording.channels).toBeDefined()
      expect(recording.source).toBeTruthy()
    },
    getTimeout()
  )

  // =============================================================================
  // 7. Webhook Handling (1 test)
  // =============================================================================

  test(
    'should verify webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Create webhook payload
      const url = 'https://myapp.com/webhook/voice'
      const params = {
        CallSid: 'CA1234567890abcdef1234567890abcdef',
        From: fromNumber,
        To: toNumber,
        CallStatus: 'ringing',
        ApiVersion: '2010-04-01',
      }

      // Convert params to URL-encoded string (Twilio webhook format)
      const paramString = Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

      const signatureData = url + paramString

      // Generate signature using auth token
      const signature = crypto.createHmac('sha1', authToken).update(signatureData).digest('base64')

      // Verify signature
      const isValid = await sdk.api.twilio.webhooks.verify({
        signature,
        url,
        params,
      })

      expect(isValid).toBe(true)

      // Test with invalid signature
      const invalidSignature = 'invalid_signature_value'
      const isInvalid = await sdk.api.twilio.webhooks.verify({
        signature: invalidSignature,
        url,
        params,
      })

      expect(isInvalid).toBe(false)
    },
    getTimeout()
  )

  // =============================================================================
  // 8. Error Handling (1 test)
  // =============================================================================

  test(
    'should handle various Twilio API errors',
    async () => {
      const sdk = runner.getSDK()

      // Test 1: Invalid phone number
      try {
        await sdk.api.twilio.messages.create({
          from: fromNumber,
          to: 'invalid-phone-number',
          body: 'Test',
        })

        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.code).toBeDefined()
        expect(error.message.toLowerCase()).toMatch(/phone|number|invalid/)
      }

      // Test 2: Insufficient funds (simulated with invalid operation)
      // Note: Real insufficient funds errors occur when account balance is low

      // Test 3: Invalid authentication
      try {
        // Create client with invalid credentials
        const invalidSdk = sdk.api.twilio.withCredentials('invalid_account_sid', 'invalid_auth_token')

        await invalidSdk.messages.list({ limit: 1 })

        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/auth|permission|invalid/)
      }

      // Test 4: Resource not found
      try {
        await sdk.api.twilio.messages.get('SM00000000000000000000000000000000')

        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.code).toBe(20404) // Twilio not found error code
      }

      // Test 5: Rate limit (difficult to test, but structure shown)
      // Twilio returns 429 Too Many Requests when rate limited
      // In production, implement exponential backoff retry logic
    },
    getTimeout()
  )
})
