/**
 * Slack Integration E2E Tests
 *
 * End-to-end tests for Slack API integration.
 * Tests cover messaging, channels, users, conversations, reactions, and webhooks.
 *
 * Prerequisites:
 * - SLACK_BOT_TOKEN environment variable must be set (Bot User OAuth Token)
 * - SLACK_TEST_CHANNEL environment variable (optional, defaults to 'general')
 * - Bot requires the following scopes:
 *   - channels:read, channels:manage (channel operations)
 *   - chat:write (post messages)
 *   - reactions:read, reactions:write (reactions)
 *   - users:read (user info)
 *   - channels:history (conversation history)
 *
 * Test Categories:
 * 1. Messaging Operations (5 tests)
 * 2. Channel Operations (4 tests)
 * 3. User Operations (3 tests)
 * 4. Conversation Operations (2 tests)
 * 5. Reactions (2 tests)
 * 6. Webhook Handling (2 tests)
 * 7. Error Handling (3 tests)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import crypto from 'crypto'

describe('Slack Integration E2E Tests', () => {
  let runner: E2ETestRunner
  let testChannel: string
  let createdMessages: Array<{ channel: string; ts: string }> = []
  let createdChannels: string[] = []

  beforeEach(async () => {
    runner = new E2ETestRunner('slack')

    // Check for bot token
    if (!process.env.SLACK_BOT_TOKEN) {
      throw new Error('SLACK_BOT_TOKEN environment variable is required for Slack E2E tests')
    }

    // Get test channel (or use default)
    testChannel = process.env.SLACK_TEST_CHANNEL || 'general'

    // Reset tracking arrays
    createdMessages = []
    createdChannels = []
  })

  afterEach(async () => {
    // Clean up messages
    const sdk = runner.getSDK()
    for (const msg of createdMessages) {
      try {
        await sdk.api.slack.chat.delete({
          channel: msg.channel,
          ts: msg.ts,
        })
      } catch (error) {
        console.warn(`Failed to delete message ${msg.ts}:`, error)
      }
    }

    // Clean up channels (archive test channels)
    for (const channelId of createdChannels) {
      try {
        await sdk.api.slack.channels.archive(channelId)
      } catch (error) {
        console.warn(`Failed to archive channel ${channelId}:`, error)
      }
    }

    await runner.teardown()
  })

  // =============================================================================
  // 1. Messaging Operations (5 tests)
  // =============================================================================

  test(
    'should post message to channel',
    async () => {
      const sdk = runner.getSDK()
      const testText = `E2E Test Message: ${runner.testId}`

      // Post message
      const result = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: testText,
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.channel).toBeTruthy()
      expect(result.ts).toBeTruthy()
      expect(result.message).toBeDefined()
      expect(result.message.text).toBe(testText)

      // Track for cleanup
      createdMessages.push({ channel: result.channel, ts: result.ts })
    },
    getTimeout()
  )

  test(
    'should post message with rich blocks formatting',
    async () => {
      const sdk = runner.getSDK()
      const testText = `E2E Test with Blocks: ${runner.testId}`

      // Post message with blocks
      const result = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: testText,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*E2E Test Message*\n${runner.testId}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'This is a test message from E2E tests',
              },
            ],
          },
        ],
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.channel).toBeTruthy()
      expect(result.ts).toBeTruthy()
      expect(result.message.blocks).toBeDefined()
      expect(result.message.blocks.length).toBe(2)

      // Track for cleanup
      createdMessages.push({ channel: result.channel, ts: result.ts })
    },
    getTimeout()
  )

  test(
    'should update existing message',
    async () => {
      const sdk = runner.getSDK()
      const originalText = `Original: ${runner.testId}`
      const updatedText = `Updated: ${runner.testId}`

      // Post initial message
      const posted = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: originalText,
      })

      expect(posted.ok).toBe(true)
      createdMessages.push({ channel: posted.channel, ts: posted.ts })

      // Update the message
      const updated = await sdk.api.slack.chat.update({
        channel: posted.channel,
        ts: posted.ts,
        text: updatedText,
      })

      expect(updated).toBeDefined()
      expect(updated.ok).toBe(true)
      expect(updated.channel).toBe(posted.channel)
      expect(updated.ts).toBe(posted.ts)
      expect(updated.text).toBe(updatedText)
    },
    getTimeout()
  )

  test(
    'should delete message',
    async () => {
      const sdk = runner.getSDK()
      const testText = `To be deleted: ${runner.testId}`

      // Post message
      const posted = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: testText,
      })

      expect(posted.ok).toBe(true)

      // Delete the message
      const deleted = await sdk.api.slack.chat.delete({
        channel: posted.channel,
        ts: posted.ts,
      })

      expect(deleted).toBeDefined()
      expect(deleted.ok).toBe(true)
      expect(deleted.channel).toBe(posted.channel)
      expect(deleted.ts).toBe(posted.ts)

      // Note: No need to track for cleanup since we deleted it
    },
    getTimeout()
  )

  test(
    'should post threaded message (reply)',
    async () => {
      const sdk = runner.getSDK()
      const parentText = `Parent message: ${runner.testId}`
      const replyText = `Reply to thread: ${runner.testId}`

      // Post parent message
      const parent = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: parentText,
      })

      expect(parent.ok).toBe(true)
      createdMessages.push({ channel: parent.channel, ts: parent.ts })

      // Post reply in thread
      const reply = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: replyText,
        thread_ts: parent.ts,
      })

      expect(reply).toBeDefined()
      expect(reply.ok).toBe(true)
      expect(reply.message.thread_ts).toBe(parent.ts)
      expect(reply.message.text).toBe(replyText)

      // Track reply for cleanup
      createdMessages.push({ channel: reply.channel, ts: reply.ts })
    },
    getTimeout()
  )

  // =============================================================================
  // 2. Channel Operations (4 tests)
  // =============================================================================

  test(
    'should list channels in workspace',
    async () => {
      const sdk = runner.getSDK()

      // List channels
      const result = await sdk.api.slack.channels.list({
        exclude_archived: true,
        limit: 100,
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.channels).toBeDefined()
      expect(Array.isArray(result.channels)).toBe(true)
      expect(result.channels.length).toBeGreaterThan(0)

      // Verify channel structure
      const channel = result.channels[0]
      expect(channel).toBeDefined()
      expect(channel.id).toBeTruthy()
      expect(channel.name).toBeTruthy()
      expect(channel.is_channel).toBe(true)
    },
    getTimeout()
  )

  test(
    'should get channel info by ID',
    async () => {
      const sdk = runner.getSDK()

      // First, list channels to get a valid channel ID
      const list = await sdk.api.slack.channels.list({
        exclude_archived: true,
        limit: 1,
      })

      expect(list.ok).toBe(true)
      expect(list.channels.length).toBeGreaterThan(0)

      const channelId = list.channels[0].id

      // Get channel info
      const result = await sdk.api.slack.channels.info(channelId)

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.channel).toBeDefined()
      expect(result.channel.id).toBe(channelId)
      expect(result.channel.name).toBeTruthy()
    },
    getTimeout()
  )

  test(
    'should create new channel',
    async () => {
      const sdk = runner.getSDK()
      const channelName = `test-${runner.testId}`.toLowerCase().replace(/_/g, '-').substring(0, 80)

      // Create channel
      const result = await sdk.api.slack.channels.create({
        name: channelName,
        is_private: false,
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.channel).toBeDefined()
      expect(result.channel.id).toBeTruthy()
      expect(result.channel.name).toBe(channelName)
      expect(result.channel.is_channel).toBe(true)

      // Track for cleanup
      createdChannels.push(result.channel.id)
    },
    getTimeout()
  )

  test(
    'should archive channel',
    async () => {
      const sdk = runner.getSDK()
      const channelName = `test-archive-${runner.testId}`.toLowerCase().replace(/_/g, '-').substring(0, 80)

      // Create channel
      const created = await sdk.api.slack.channels.create({
        name: channelName,
        is_private: false,
      })

      expect(created.ok).toBe(true)
      const channelId = created.channel.id

      // Archive the channel
      const archived = await sdk.api.slack.channels.archive(channelId)

      expect(archived).toBeDefined()
      expect(archived.ok).toBe(true)

      // Verify channel is archived
      const info = await sdk.api.slack.channels.info(channelId)
      expect(info.channel.is_archived).toBe(true)

      // Note: No need to track for cleanup since we archived it
    },
    getTimeout()
  )

  // =============================================================================
  // 3. User Operations (3 tests)
  // =============================================================================

  test(
    'should list users in workspace',
    async () => {
      const sdk = runner.getSDK()

      // List users
      const result = await sdk.api.slack.users.list({
        limit: 100,
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.members).toBeDefined()
      expect(Array.isArray(result.members)).toBe(true)
      expect(result.members.length).toBeGreaterThan(0)

      // Verify user structure
      const user = result.members[0]
      expect(user).toBeDefined()
      expect(user.id).toBeTruthy()
      expect(user.name).toBeTruthy()
      expect(user.profile).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should get user info by ID',
    async () => {
      const sdk = runner.getSDK()

      // First, list users to get a valid user ID
      const list = await sdk.api.slack.users.list({
        limit: 1,
      })

      expect(list.ok).toBe(true)
      expect(list.members.length).toBeGreaterThan(0)

      const userId = list.members[0].id

      // Get user info
      const result = await sdk.api.slack.users.info(userId)

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user.id).toBe(userId)
      expect(result.user.name).toBeTruthy()
      expect(result.user.profile).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should get user by email',
    async () => {
      const sdk = runner.getSDK()

      // Get test user email from environment or skip
      const testEmail = process.env.SLACK_TEST_USER_EMAIL

      if (!testEmail) {
        console.log('Skipping test: SLACK_TEST_USER_EMAIL not set')
        return
      }

      // Look up user by email
      const result = await sdk.api.slack.users.lookupByEmail(testEmail)

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user.id).toBeTruthy()
      expect(result.user.profile.email).toBe(testEmail)
    },
    getTimeout()
  )

  // =============================================================================
  // 4. Conversation Operations (2 tests)
  // =============================================================================

  test(
    'should get conversation history',
    async () => {
      const sdk = runner.getSDK()

      // Post a message first to ensure there's history
      const posted = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: `History test: ${runner.testId}`,
      })

      expect(posted.ok).toBe(true)
      createdMessages.push({ channel: posted.channel, ts: posted.ts })

      // Get conversation history
      const result = await sdk.api.slack.conversations.history({
        channel: testChannel,
        limit: 10,
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.messages).toBeDefined()
      expect(Array.isArray(result.messages)).toBe(true)
      expect(result.messages.length).toBeGreaterThan(0)

      // Verify our message is in the history
      const ourMessage = result.messages.find((msg) => msg.ts === posted.ts)
      expect(ourMessage).toBeDefined()
      expect(ourMessage?.text).toContain(runner.testId)
    },
    getTimeout()
  )

  test(
    'should get thread replies',
    async () => {
      const sdk = runner.getSDK()

      // Post parent message
      const parent = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: `Thread parent: ${runner.testId}`,
      })

      expect(parent.ok).toBe(true)
      createdMessages.push({ channel: parent.channel, ts: parent.ts })

      // Post reply
      const reply = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: `Thread reply: ${runner.testId}`,
        thread_ts: parent.ts,
      })

      expect(reply.ok).toBe(true)
      createdMessages.push({ channel: reply.channel, ts: reply.ts })

      // Get thread replies
      const result = await sdk.api.slack.conversations.replies({
        channel: testChannel,
        ts: parent.ts,
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)
      expect(result.messages).toBeDefined()
      expect(Array.isArray(result.messages)).toBe(true)
      expect(result.messages.length).toBeGreaterThanOrEqual(2) // Parent + reply

      // Verify parent and reply are in results
      const parentMsg = result.messages.find((msg) => msg.ts === parent.ts)
      const replyMsg = result.messages.find((msg) => msg.ts === reply.ts)

      expect(parentMsg).toBeDefined()
      expect(replyMsg).toBeDefined()
      expect(replyMsg?.thread_ts).toBe(parent.ts)
    },
    getTimeout()
  )

  // =============================================================================
  // 5. Reactions (2 tests)
  // =============================================================================

  test(
    'should add reaction to message',
    async () => {
      const sdk = runner.getSDK()

      // Post a message
      const posted = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: `Reaction test: ${runner.testId}`,
      })

      expect(posted.ok).toBe(true)
      createdMessages.push({ channel: posted.channel, ts: posted.ts })

      // Add reaction
      const result = await sdk.api.slack.reactions.add({
        channel: posted.channel,
        timestamp: posted.ts,
        name: 'thumbsup',
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)

      // Verify reaction was added (get message and check reactions)
      const history = await sdk.api.slack.conversations.history({
        channel: posted.channel,
        latest: posted.ts,
        inclusive: true,
        limit: 1,
      })

      expect(history.ok).toBe(true)
      expect(history.messages.length).toBe(1)
      expect(history.messages[0].reactions).toBeDefined()
      expect(history.messages[0].reactions.length).toBeGreaterThan(0)
      expect(history.messages[0].reactions[0].name).toBe('thumbsup')
    },
    getTimeout()
  )

  test(
    'should remove reaction from message',
    async () => {
      const sdk = runner.getSDK()

      // Post a message
      const posted = await sdk.api.slack.chat.postMessage({
        channel: testChannel,
        text: `Remove reaction test: ${runner.testId}`,
      })

      expect(posted.ok).toBe(true)
      createdMessages.push({ channel: posted.channel, ts: posted.ts })

      // Add reaction
      await sdk.api.slack.reactions.add({
        channel: posted.channel,
        timestamp: posted.ts,
        name: 'eyes',
      })

      // Remove reaction
      const result = await sdk.api.slack.reactions.remove({
        channel: posted.channel,
        timestamp: posted.ts,
        name: 'eyes',
      })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true)

      // Verify reaction was removed
      const history = await sdk.api.slack.conversations.history({
        channel: posted.channel,
        latest: posted.ts,
        inclusive: true,
        limit: 1,
      })

      expect(history.ok).toBe(true)
      expect(history.messages.length).toBe(1)

      // Message should have no reactions or reactions array shouldn't include 'eyes'
      const message = history.messages[0]
      if (message.reactions) {
        const eyesReaction = message.reactions.find((r) => r.name === 'eyes')
        expect(eyesReaction).toBeUndefined()
      }
    },
    getTimeout()
  )

  // =============================================================================
  // 6. Webhook Handling (2 tests)
  // =============================================================================

  test(
    'should verify valid webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Slack signing secret (from environment)
      const signingSecret = process.env.SLACK_SIGNING_SECRET

      if (!signingSecret) {
        console.log('Skipping test: SLACK_SIGNING_SECRET not set')
        return
      }

      // Create test webhook payload
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const body = JSON.stringify({
        type: 'event_callback',
        event: {
          type: 'message',
          text: 'Test message',
        },
      })

      // Generate signature
      const signatureBaseString = `v0:${timestamp}:${body}`
      const signature = 'v0=' + crypto.createHmac('sha256', signingSecret).update(signatureBaseString).digest('hex')

      // Verify signature
      const result = await sdk.api.slack.webhooks.verify({
        body,
        timestamp,
        signature,
        signingSecret,
      })

      expect(result).toBeDefined()
      expect(result.valid).toBe(true)
    },
    getTimeout()
  )

  test(
    'should reject invalid webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Slack signing secret (from environment)
      const signingSecret = process.env.SLACK_SIGNING_SECRET

      if (!signingSecret) {
        console.log('Skipping test: SLACK_SIGNING_SECRET not set')
        return
      }

      // Create test webhook payload
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const body = JSON.stringify({
        type: 'event_callback',
        event: {
          type: 'message',
          text: 'Test message',
        },
      })

      // Use INVALID signature
      const invalidSignature = 'v0=invalid_signature_12345'

      // Verify signature (should fail)
      const result = await sdk.api.slack.webhooks.verify({
        body,
        timestamp,
        signature: invalidSignature,
        signingSecret,
      })

      expect(result).toBeDefined()
      expect(result.valid).toBe(false)
    },
    getTimeout()
  )

  // =============================================================================
  // 7. Error Handling (3 tests)
  // =============================================================================

  test(
    'should handle invalid token error',
    async () => {
      const sdk = runner.getSDK()

      // Create a client with invalid token
      try {
        // This should throw an error when making any API call
        await sdk.api.slack.withToken('xoxb-invalid-token').users.list({ limit: 1 })

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        // Slack API returns 'invalid_auth' error
        expect(error.message.toLowerCase()).toContain('invalid')
      }
    },
    getTimeout()
  )

  test(
    'should handle channel not found error',
    async () => {
      const sdk = runner.getSDK()

      // Try to get info for non-existent channel
      try {
        await sdk.api.slack.channels.info('C0000000000')

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        // Slack API returns 'channel_not_found' error
        expect(error.message.toLowerCase()).toMatch(/channel|not found/)
      }
    },
    getTimeout()
  )

  test(
    'should handle user not found error',
    async () => {
      const sdk = runner.getSDK()

      // Try to get info for non-existent user
      try {
        await sdk.api.slack.users.info('U0000000000')

        // Should not reach here
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        // Slack API returns 'user_not_found' error
        expect(error.message.toLowerCase()).toMatch(/user|not found/)
      }
    },
    getTimeout()
  )
})
