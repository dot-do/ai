# Zoom Integration

Video conferencing and virtual meeting platform

**Category**: communication
**Service**: Zoom
**Base URL**: https://api.zoom.us/v2

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoom](https://integrations.do/zoom)

## Installation

```bash
npm install @dotdo/integration-zoom
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoom
```

## Quick Start

```typescript
import { ZoomClient } from '@dotdo/integration-zoom'

// Initialize client
const client = new ZoomClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ZoomClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Meeting

Schedule and manage Zoom meetings

#### `meeting.create()`

```typescript
const result = await client.meeting.create({
  userId: 'example', // User ID or 'me'
  topic: 'example', // Meeting topic
  type: 123, // Meeting type (1=instant, 2=scheduled, 3=recurring, 8=recurring with fixed time)
  start_time: 'example', // Meeting start time (ISO 8601)
  duration: 123, // Meeting duration in minutes
  timezone: 'example', // Timezone (e.g., America/New_York)
  password: 'example', // Meeting password
  agenda: 'example', // Meeting agenda
  settings: {}, // Meeting settings
})
```

#### `meeting.get()`

```typescript
const result = await client.meeting.get({
  meetingId: 'example', // Meeting ID
})
```

#### `meeting.update()`

```typescript
const result = await client.meeting.update({
  meetingId: 'example', // Meeting ID
  topic: 'example', // New meeting topic
  start_time: 'example', // New start time
  duration: 123, // New duration
})
```

#### `meeting.delete()`

```typescript
const result = await client.meeting.delete({
  meetingId: 'example', // Meeting ID
})
```

#### `meeting.list()`

```typescript
const result = await client.meeting.list({
  userId: 'example', // User ID or 'me'
  type: 'example', // Meeting type (scheduled, live, upcoming)
  page_size: 123, // Number of records per page
})
```

### Webinar

Create and manage webinars

#### `webinar.create()`

```typescript
const result = await client.webinar.create({
  userId: 'example', // User ID or 'me'
  topic: 'example', // Webinar topic
  type: 123, // Webinar type (5=webinar, 6=recurring, 9=recurring with fixed time)
  start_time: 'example', // Webinar start time
  duration: 123, // Duration in minutes
  agenda: 'example', // Webinar agenda
})
```

#### `webinar.get()`

```typescript
const result = await client.webinar.get({
  webinarId: 'example', // Webinar ID
})
```

#### `webinar.update()`

```typescript
const result = await client.webinar.update({
  webinarId: 'example', // Webinar ID
  topic: 'example', // New webinar topic
})
```

#### `webinar.delete()`

```typescript
const result = await client.webinar.delete({
  webinarId: 'example', // Webinar ID
})
```

### User

Manage Zoom users

#### `user.get()`

```typescript
const result = await client.user.get({
  userId: 'example', // User ID or email
})
```

#### `user.list()`

```typescript
const result = await client.user.list({
  status: 'example', // User status (active, inactive, pending)
  page_size: 123, // Number of users per page
})
```

### Recording

Manage cloud recordings

#### `recording.list()`

```typescript
const result = await client.recording.list({
  userId: 'example', // User ID or 'me'
  from: 'example', // Start date (YYYY-MM-DD)
  to: 'example', // End date (YYYY-MM-DD)
})
```

#### `recording.get()`

```typescript
const result = await client.recording.get({
  meetingId: 'example', // Meeting ID
})
```

#### `recording.delete()`

```typescript
const result = await client.recording.delete({
  meetingId: 'example', // Meeting ID
})
```

## Error Handling

All errors are thrown as `ZoomError` instances with additional metadata:

```typescript
try {
  const result = await client.meeting.list()
} catch (error) {
  if (error instanceof ZoomError) {
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
import { ZoomWebhookHandler, WebhookEventRouter } from '@dotdo/integration-zoom'

// Initialize webhook handler
const handler = new ZoomWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onMeetingStarted(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `meeting.started` - Meeting has started
- `meeting.ended` - Meeting has ended
- `meeting.participant_joined` - Participant joined meeting
- `meeting.participant_left` - Participant left meeting
- `webinar.started` - Webinar has started
- `webinar.ended` - Webinar has ended
- `recording.completed` - Recording has been completed
- `recording.transcript_completed` - Recording transcript completed

## License

MIT
