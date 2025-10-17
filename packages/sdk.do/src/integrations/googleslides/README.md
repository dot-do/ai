# Google Slides Integration

Google Slides is a cloud-based presentation editor with real-time collaboration, template gallery, and integration with other Google Workspace apps

**Category**: productivity
**Service**: Googleslides
**Base URL**: https://api.googleslides.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googleslides](https://integrations.do/googleslides)

## Installation

```bash
npm install @dotdo/integration-googleslides
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googleslides
```

## Quick Start

```typescript
import { GoogleslidesClient } from '@dotdo/integration-googleslides'

// Initialize client
const client = new GoogleslidesClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogleslidesClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Slides actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogleslidesError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogleslidesError) {
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
import { GoogleslidesWebhookHandler, WebhookEventRouter } from '@dotdo/integration-googleslides'

// Initialize webhook handler
const handler = new GoogleslidesWebhookHandler(process.env.WEBHOOK_SECRET)

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
