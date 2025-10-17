# Google Docs Integration

Google Docs is a cloud-based word processor with real-time collaboration, version history, and integration with other Google Workspace apps

**Category**: productivity
**Service**: Googledocs
**Base URL**: https://api.googledocs.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googledocs](https://integrations.do/googledocs)

## Installation

```bash
npm install @dotdo/integration-googledocs
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googledocs
```

## Quick Start

```typescript
import { GoogledocsClient } from '@dotdo/integration-googledocs'

// Initialize client
const client = new GoogledocsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogledocsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Docs actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogledocsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogledocsError) {
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
import { GoogledocsWebhookHandler, WebhookEventRouter } from '@dotdo/integration-googledocs'

// Initialize webhook handler
const handler = new GoogledocsWebhookHandler(process.env.WEBHOOK_SECRET)

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
