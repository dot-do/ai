# Google Drive Integration

Google Drive is a cloud storage solution for uploading, sharing, and collaborating on files across devices, with robust search and offline access

**Category**: storage
**Service**: Googledrive
**Base URL**: https://api.googledrive.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googledrive](https://integrations.do/googledrive)

## Installation

```bash
npm install @dotdo/integration-googledrive
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googledrive
```

## Quick Start

```typescript
import { GoogledriveClient } from '@dotdo/integration-googledrive'

// Initialize client
const client = new GoogledriveClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogledriveClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Drive actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogledriveError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogledriveError) {
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
import { GoogledriveWebhookHandler, WebhookEventRouter } from '@dotdo/integration-googledrive'

// Initialize webhook handler
const handler = new GoogledriveWebhookHandler(process.env.WEBHOOK_SECRET)

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
