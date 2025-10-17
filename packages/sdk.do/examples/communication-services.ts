/**
 * Communication Services Examples
 *
 * Demonstrates how to use email, text/SMS, and voice/call services
 * in the SDK.do package.
 */

import { $ } from '../src/index'

// ============================================================================
// EMAIL SERVICE EXAMPLES
// ============================================================================

/**
 * Example 1: Send a simple email
 */
async function sendSimpleEmail() {
  const result = await $.email.send({
    to: 'customer@example.com',
    from: 'support@myapp.com',
    subject: 'Welcome to MyApp',
    html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
    text: 'Welcome! Thanks for signing up.',
  })

  console.log('Email sent:', result.messageId)
}

/**
 * Example 2: Send email with template
 */
async function sendTemplateEmail() {
  const result = await $.email.sendTemplate('welcome-email', 'newuser@example.com', {
    name: 'Jane Doe',
    activationLink: 'https://myapp.com/activate/abc123',
    supportEmail: 'support@myapp.com',
  })

  console.log('Template email sent:', result.messageId)
}

/**
 * Example 3: Send bulk emails
 */
async function sendBulkEmails() {
  const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com']

  const messages = recipients.map((email) => ({
    to: email,
    from: 'newsletter@myapp.com',
    subject: 'Monthly Newsletter',
    html: "<h1>Latest Updates</h1><p>Check out what's new this month!</p>",
  }))

  const result = await $.email.sendBulk(messages)
  console.log(`Sent ${result.successful}/${result.total} emails`)
}

/**
 * Example 4: Track email delivery
 */
async function trackEmailDelivery(messageId: string) {
  // Get delivery status
  const status = await $.email.getStatus(messageId)
  console.log('Status:', status.status)
  console.log('Events:', status.events)

  // Get tracking data
  const tracking = await $.email.track(messageId)
  console.log('Opens:', tracking.opens)
  console.log('Clicks:', tracking.clicks)
  console.log('Clicked links:', tracking.clickedLinks)
}

/**
 * Example 5: Email event handlers
 */
function setupEmailEventHandlers() {
  $.email.on.delivered(async (event) => {
    console.log(`Email ${event.messageId} delivered to ${event.recipient}`)
  })

  $.email.on.bounced(async (event) => {
    console.log(`Email ${event.messageId} bounced: ${event.reason}`)
  })

  $.email.on.opened(async (event) => {
    console.log(`Email ${event.messageId} opened by ${event.recipient}`)
  })

  $.email.on.clicked(async (event) => {
    console.log(`Link clicked in email ${event.messageId}: ${event.url}`)
  })
}

// ============================================================================
// TEXT/SMS SERVICE EXAMPLES
// ============================================================================

/**
 * Example 6: Send SMS message
 */
async function sendSMS() {
  const result = await $.text.send({
    to: '+1234567890',
    from: '+0987654321',
    body: 'Your order #12345 has been shipped!',
  })

  console.log('SMS sent:', result.messageId)
  console.log('Segments:', result.segments)
}

/**
 * Example 7: Send verification code
 */
async function sendVerificationCode(phoneNumber: string) {
  const result = await $.text.sendVerification(phoneNumber, {
    channel: 'sms',
    codeLength: 6,
    locale: 'en',
    appName: 'MyApp',
  })

  console.log('Verification sent:', result.verificationId)
  console.log('Expires at:', result.expiresAt)

  return result.verificationId
}

/**
 * Example 8: Verify code
 */
async function verifyCode(phoneNumber: string, code: string) {
  const result = await $.text.checkVerification(phoneNumber, code)

  if (result.valid) {
    console.log('Verification successful!')
    return true
  } else {
    console.log('Invalid code')
    return false
  }
}

/**
 * Example 9: Format and validate phone numbers
 */
function formatPhoneNumbers() {
  // Format US phone number
  const formatted = $.text.formatPhone('(555) 123-4567', 'US')
  console.log('Formatted:', formatted) // +15551234567

  // Validate phone number
  const isValid = $.text.validatePhone('+1234567890')
  console.log('Valid:', isValid)
}

/**
 * Example 10: SMS event handlers
 */
function setupSMSEventHandlers() {
  $.text.on.received(async (event) => {
    console.log(`SMS received from ${event.from}: ${event.body}`)
  })

  $.text.on.delivered(async (event) => {
    console.log(`SMS ${event.messageId} delivered`)
  })

  $.text.on.failed(async (event) => {
    console.log(`SMS ${event.messageId} failed: ${event.errorMessage}`)
  })
}

// ============================================================================
// VOICE/CALL SERVICE EXAMPLES
// ============================================================================

/**
 * Example 11: Make voice call with TwiML
 */
async function makeVoiceCall() {
  const call = await $.voice.make({
    to: '+1234567890',
    from: '+0987654321',
    url: 'https://myapp.com/voice/greeting.xml',
    record: true,
    transcribe: true,
    statusCallback: 'https://myapp.com/webhooks/call-status',
  })

  console.log('Call initiated:', call.callId)
  console.log('Status:', call.status)
}

/**
 * Example 12: Make call with text-to-speech
 */
async function makeTextToSpeechCall() {
  const call = await $.voice.make({
    to: '+1234567890',
    from: '+0987654321',
    message: 'Hello! This is a reminder about your appointment tomorrow at 2 PM. Please call us to confirm.',
    voice: 'en-US-Standard-A',
    record: true,
  })

  console.log('Call initiated:', call.callId)
}

/**
 * Example 13: Get call status and details
 */
async function getCallDetails(callId: string) {
  const status = await $.voice.getStatus(callId)
  console.log('Status:', status.status)
  console.log('Duration:', status.duration)
  console.log('Answered by:', status.answeredBy)
  console.log('Events:', status.events)
}

/**
 * Example 14: Get call recording and transcript
 */
async function getCallRecordingAndTranscript(callId: string) {
  // Get recording
  const recording = await $.voice.getRecording(callId)
  console.log('Recording URL:', recording.url)
  console.log('Duration:', recording.duration)

  // Download recording
  const audioBlob = await $.voice.downloadRecording(callId)
  console.log('Downloaded:', audioBlob.size, 'bytes')

  // Get transcript
  const transcript = await $.voice.getTranscript(callId)
  console.log('Transcript:', transcript.text)
  console.log('Confidence:', transcript.confidence)

  // Word-level timestamps
  if (transcript.words) {
    transcript.words.forEach((word) => {
      console.log(`${word.word} (${word.start}s - ${word.end}s): ${word.confidence}`)
    })
  }
}

/**
 * Example 15: Cancel in-progress call
 */
async function cancelCall(callId: string) {
  const status = await $.voice.cancel(callId)
  console.log('Call canceled:', status.status === 'canceled')
}

/**
 * Example 16: List recent calls
 */
async function listRecentCalls() {
  const calls = await $.voice.list({
    limit: 10,
    status: 'completed',
    from: '+0987654321',
  })

  calls.forEach((call) => {
    console.log(`Call ${call.callId}: ${call.to} - ${call.status}`)
  })
}

/**
 * Example 17: Voice event handlers
 */
function setupVoiceEventHandlers() {
  $.voice.on.initiated(async (event) => {
    console.log(`Call ${event.callId} initiated to ${event.to}`)
  })

  $.voice.on.answered(async (event) => {
    console.log(`Call ${event.callId} answered by ${event.answeredBy}`)
  })

  $.voice.on.completed(async (event) => {
    console.log(`Call ${event.callId} completed. Duration: ${event.duration}s`)
  })

  $.voice.on.recording(async (event) => {
    console.log(`Recording available for call ${event.callId}: ${event.url}`)
  })
}

// ============================================================================
// COMBINED WORKFLOW EXAMPLES
// ============================================================================

/**
 * Example 18: Complete verification workflow
 */
async function completeVerificationWorkflow(phoneNumber: string) {
  // Step 1: Send verification code
  console.log('Sending verification code...')
  const verification = await $.text.sendVerification(phoneNumber, {
    channel: 'sms',
    codeLength: 6,
    appName: 'MyApp',
  })

  console.log(`Verification code sent. ID: ${verification.verificationId}`)

  // Step 2: User enters code (simulated)
  const userEnteredCode = '123456' // This would come from user input

  // Step 3: Verify code
  console.log('Verifying code...')
  const result = await $.text.checkVerification(phoneNumber, userEnteredCode)

  if (result.valid) {
    // Step 4: Send confirmation email
    console.log('Verification successful! Sending confirmation email...')
    await $.email.send({
      to: 'user@example.com',
      from: 'noreply@myapp.com',
      subject: 'Phone Verified',
      html: '<h1>Phone Verified</h1><p>Your phone number has been successfully verified.</p>',
    })

    console.log('Workflow complete!')
    return true
  } else {
    console.log('Verification failed')
    return false
  }
}

/**
 * Example 19: Order notification workflow
 */
async function sendOrderNotifications(orderId: string, customerEmail: string, customerPhone: string) {
  // Send email notification
  await $.email.sendTemplate('order-confirmation', customerEmail, {
    orderId,
    trackingUrl: `https://myapp.com/track/${orderId}`,
  })

  // Send SMS notification
  await $.text.send({
    to: customerPhone,
    from: '+0987654321',
    body: `Your order #${orderId} has been confirmed! Track it at: https://myapp.com/track/${orderId}`,
  })

  console.log(`Notifications sent for order ${orderId}`)
}

/**
 * Example 20: Appointment reminder workflow
 */
async function sendAppointmentReminder(appointmentTime: Date, customerPhone: string, customerEmail: string) {
  const timeString = appointmentTime.toLocaleString()

  // Send email reminder
  await $.email.sendTemplate('appointment-reminder', customerEmail, {
    appointmentTime: timeString,
    confirmUrl: 'https://myapp.com/confirm/abc123',
  })

  // Make voice call
  const call = await $.voice.make({
    to: customerPhone,
    from: '+0987654321',
    message: `Hello! This is a reminder about your appointment on ${timeString}. Please press 1 to confirm or press 2 to reschedule.`,
    voice: 'en-US-Standard-A',
    record: true,
  })

  console.log(`Appointment reminder sent. Call ID: ${call.callId}`)
}

// ============================================================================
// EXPORT EXAMPLES
// ============================================================================

export {
  // Email examples
  sendSimpleEmail,
  sendTemplateEmail,
  sendBulkEmails,
  trackEmailDelivery,
  setupEmailEventHandlers,
  // SMS examples
  sendSMS,
  sendVerificationCode,
  verifyCode,
  formatPhoneNumbers,
  setupSMSEventHandlers,
  // Voice examples
  makeVoiceCall,
  makeTextToSpeechCall,
  getCallDetails,
  getCallRecordingAndTranscript,
  cancelCall,
  listRecentCalls,
  setupVoiceEventHandlers,
  // Workflow examples
  completeVerificationWorkflow,
  sendOrderNotifications,
  sendAppointmentReminder,
}
