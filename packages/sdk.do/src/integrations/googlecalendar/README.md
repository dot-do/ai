# Google Calendar Integration

Google Calendar is a time management tool providing scheduling features, event reminders, and integration with email and other apps for streamlined organization

**Category**: productivity
**Service**: Googlecalendar
**Base URL**: https://api.googlecalendar.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googlecalendar](https://integrations.do/googlecalendar)

## Installation

```bash
npm install @dotdo/integration-googlecalendar
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googlecalendar
```

## Quick Start

```typescript
import { GooglecalendarClient } from '@dotdo/integration-googlecalendar'

// Initialize client
const client = new GooglecalendarClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GooglecalendarClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Calendar actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GooglecalendarError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GooglecalendarError) {
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
import { GooglecalendarWebhookHandler, WebhookEventRouter } from '@dotdo/integration-googlecalendar'

// Initialize webhook handler
const handler = new GooglecalendarWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onGenericTrigger(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `trigger` - Generic webhook trigger

## License

MIT
