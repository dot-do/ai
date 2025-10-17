# Twilio Integration

Cloud communications platform for SMS, voice, video, and authentication

**Category**: communication
**Service**: Twilio
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/twilio](https://integrations.do/twilio)

## Installation

```bash
npm install @dotdo/integration-twilio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-twilio
```

## Quick Start

```typescript
import { TwilioClient } from '@dotdo/integration-twilio'

// Initialize client
const client = new TwilioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TwilioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Message

Send and receive SMS and MMS messages

#### `message.create()`

```typescript
const result = await client.message.create({
  from: 'example', // Phone number to send from (E.164 format)
  to: 'example', // Phone number to send to (E.164 format)
  body: 'example', // Message body (up to 1600 characters)
  mediaUrl: value, // Media URLs for MMS
  statusCallback: 'example', // URL to receive status callbacks
  messagingServiceSid: 'example', // Messaging Service SID (alternative to from)
  maxPrice: 123, // Maximum price willing to pay for message
  validityPeriod: 123, // Number of seconds message is valid
})
```

#### `message.get()`

```typescript
const result = await client.message.get({
  sid: 'example', // Message SID
})
```

#### `message.list()`

```typescript
const result = await client.message.list({
  to: 'example', // Filter by to phone number
  from: 'example', // Filter by from phone number
  dateSent: value, // Filter by date sent
  limit: 123, // Maximum number of messages to return
})
```

#### `message.delete()`

```typescript
const result = await client.message.delete({
  sid: 'example', // Message SID
})
```

### Call

Make and manage voice calls

#### `call.create()`

```typescript
const result = await client.call.create({
  from: 'example', // Phone number to call from (E.164 format)
  to: 'example', // Phone number to call (E.164 format)
  url: 'example', // TwiML instructions URL
  twiml: 'example', // Inline TwiML instructions
  statusCallback: 'example', // URL to receive call status callbacks
  timeout: 123, // Timeout in seconds before call is considered unanswered
  record: true, // Record the call
  machineDetection: 'example', // Machine detection (Enable or DetectMessageEnd)
})
```

#### `call.get()`

```typescript
const result = await client.call.get({
  sid: 'example', // Call SID
})
```

#### `call.update()`

```typescript
const result = await client.call.update({
  sid: 'example', // Call SID
  url: 'example', // New TwiML instructions URL
  twiml: 'example', // New TwiML instructions
  status: 'example', // New call status (canceled or completed)
})
```

#### `call.list()`

```typescript
const result = await client.call.list({
  to: 'example', // Filter by to phone number
  from: 'example', // Filter by from phone number
  status: 'example', // Filter by call status
  limit: 123, // Maximum number of calls to return
})
```

### PhoneNumber

Manage phone numbers in your account

#### `phoneNumber.create()`

```typescript
const result = await client.phoneNumber.create({
  phoneNumber: 'example', // Phone number to purchase (E.164 format)
  friendlyName: 'example', // Friendly name for the number
  voiceUrl: 'example', // Voice URL for incoming calls
  smsUrl: 'example', // SMS URL for incoming messages
})
```

#### `phoneNumber.get()`

```typescript
const result = await client.phoneNumber.get({
  sid: 'example', // Phone number SID
})
```

#### `phoneNumber.list()`

```typescript
const result = await client.phoneNumber.list({
  limit: 123, // Maximum number of phone numbers to return
})
```

#### `phoneNumber.delete()`

```typescript
const result = await client.phoneNumber.delete({
  sid: 'example', // Phone number SID
})
```

### MessagingService

Manage messaging services for scaled SMS operations

#### `messagingService.create()`

```typescript
const result = await client.messagingService.create({
  friendlyName: 'example', // Friendly name for the service
  inboundRequestUrl: 'example', // URL for inbound message requests
  statusCallback: 'example', // URL for status callbacks
})
```

#### `messagingService.get()`

```typescript
const result = await client.messagingService.get({
  sid: 'example', // Service SID
})
```

#### `messagingService.list()`

```typescript
const result = await client.messagingService.list({
  limit: 123, // Maximum number of services to return
})
```

### Verification

Send and verify codes for two-factor authentication

#### `verification.sendCode()`

```typescript
const result = await client.verification.sendCode({
  serviceSid: 'example', // Verify service SID
  to: 'example', // Phone number to verify (E.164 format)
  channel: 'example', // Verification channel (sms, call, or email)
  codeLength: 123, // Custom code length (4-10 digits)
  locale: 'example', // Locale for message
})
```

#### `verification.checkCode()`

```typescript
const result = await client.verification.checkCode({
  serviceSid: 'example', // Verify service SID
  to: 'example', // Phone number being verified (E.164 format)
  code: 'example', // Verification code to check
})
```

### Conference

Manage conference calls

#### `conference.create()`

```typescript
const result = await client.conference.create({
  friendlyName: 'example', // Friendly name for the conference
  statusCallback: 'example', // Status callback URL
  record: true, // Record the conference
})
```

#### `conference.get()`

```typescript
const result = await client.conference.get({
  sid: 'example', // Conference SID
})
```

#### `conference.list()`

```typescript
const result = await client.conference.list({
  friendlyName: 'example', // Filter by conference name
  status: 'example', // Filter by conference status
  limit: 123, // Maximum number of conferences to return
})
```

#### `conference.listParticipants()`

```typescript
const result = await client.conference.listParticipants({
  conferenceSid: 'example', // Conference SID
})
```

### Recording

Manage call and conference recordings

#### `recording.get()`

```typescript
const result = await client.recording.get({
  sid: 'example', // Recording SID
})
```

#### `recording.list()`

```typescript
const result = await client.recording.list({
  callSid: 'example', // Filter by call SID
  conferenceSid: 'example', // Filter by conference SID
  limit: 123, // Maximum number of recordings to return
})
```

#### `recording.delete()`

```typescript
const result = await client.recording.delete({
  sid: 'example', // Recording SID
})
```

## Error Handling

All errors are thrown as `TwilioError` instances with additional metadata:

```typescript
try {
  const result = await client.message.list()
} catch (error) {
  if (error instanceof TwilioError) {
    console.error('Error type:', error.type)
    console.error('Error code:', error.code)
    console.error('Status code:', error.statusCode)
    console.error('Retryable:', error.isRetriable())
  }
}
```

**Error Types:**

- `authentication` - Authentication failed
- `authorization` - Insufficient permissions
- `validation` - Invalid parameters
- `not_found` - Resource not found
- `rate_limit` - Rate limit exceeded
- `server` - Server error
- `network` - Network error
- `unknown` - Unknown error

## Webhooks

This Integration supports webhooks for real-time event notifications.

```typescript
import { TwilioWebhookHandler, WebhookEventRouter } from '@dotdo/integration-twilio'

// Initialize webhook handler
const handler = new TwilioWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onMessageSent(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `message.sent` - SMS message has been sent
- `message.delivered` - SMS message has been delivered to recipient
- `message.failed` - SMS message failed to send
- `message.undelivered` - SMS message could not be delivered
- `message.received` - Incoming SMS message received
- `call.initiated` - Call has been initiated
- `call.ringing` - Phone is ringing
- `call.answered` - Call has been answered
- `call.completed` - Call has been completed
- `call.failed` - Call failed
- `call.busy` - Called number is busy
- `call.no_answer` - Called number did not answer
- `recording.available` - Recording is available for download
- `recording.failed` - Recording failed
- `conference.start` - Conference has started
- `conference.end` - Conference has ended
- `conference.participant.join` - Participant joined conference
- `conference.participant.leave` - Participant left conference

## License

MIT
