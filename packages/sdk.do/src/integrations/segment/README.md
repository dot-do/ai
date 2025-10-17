# Segment Integration

Customer data platform for collecting, cleaning, and controlling data

**Category**: analytics
**Service**: Segment
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/segment](https://integrations.do/segment)

## Installation

```bash
npm install @dotdo/integration-segment
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-segment
```

## Quick Start

```typescript
import { SegmentClient } from '@dotdo/integration-segment'

// Initialize client
const client = new SegmentClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SegmentClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Event

Track user events and actions

#### `event.track()`

```typescript
const result = await client.event.track({
  userId: 'example', // User ID (required if anonymousId not provided)
  anonymousId: 'example', // Anonymous ID (required if userId not provided)
  event: 'example', // Event name
  properties: {}, // Event properties
  context: {}, // Context information
  timestamp: 'example', // Event timestamp (ISO 8601)
})
```

#### `event.batch()`

```typescript
const result = await client.event.batch({
  batch: [], // Array of track/identify/group/page events
})
```

### Identify

Identify users and their traits

#### `identify.identify()`

```typescript
const result = await client.identify.identify({
  userId: 'example', // User ID (required if anonymousId not provided)
  anonymousId: 'example', // Anonymous ID (required if userId not provided)
  traits: {}, // User traits (name, email, etc.)
  context: {}, // Context information
  timestamp: 'example', // Event timestamp (ISO 8601)
})
```

### Group

Associate users with groups

#### `group.group()`

```typescript
const result = await client.group.group({
  userId: 'example', // User ID (required if anonymousId not provided)
  anonymousId: 'example', // Anonymous ID (required if userId not provided)
  groupId: 'example', // Group ID
  traits: {}, // Group traits
  context: {}, // Context information
})
```

### Page

Track page views

#### `page.page()`

```typescript
const result = await client.page.page({
  userId: 'example', // User ID (required if anonymousId not provided)
  anonymousId: 'example', // Anonymous ID (required if userId not provided)
  name: 'example', // Page name
  category: 'example', // Page category
  properties: {}, // Page properties
  context: {}, // Context information
})
```

## Error Handling

All errors are thrown as `SegmentError` instances with additional metadata:

```typescript
try {
  const result = await client.event.list()
} catch (error) {
  if (error instanceof SegmentError) {
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
import { SegmentWebhookHandler, WebhookEventRouter } from '@dotdo/integration-segment'

// Initialize webhook handler
const handler = new SegmentWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onTrack(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `track` - Track event received
- `identify` - Identify call received
- `group` - Group call received
- `page` - Page call received
- `screen` - Screen call received

## License

MIT
