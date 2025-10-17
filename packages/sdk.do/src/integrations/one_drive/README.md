# One drive Integration

OneDrive is Microsoft’s cloud storage solution enabling users to store, sync, and share files across devices, offering offline access, real-time collaboration, and enterprise-grade security

**Category**: storage
**Service**: OneDrive
**Base URL**: https://api.one_drive.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/one_drive](https://integrations.do/one_drive)

## Installation

```bash
npm install @dotdo/integration-one_drive
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-one_drive
```

## Quick Start

```typescript
import { OneDriveClient } from '@dotdo/integration-one_drive'

// Initialize client
const client = new OneDriveClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new OneDriveClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute One drive actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OneDriveError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OneDriveError) {
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
import { OneDriveWebhookHandler, WebhookEventRouter } from '@dotdo/integration-one_drive'

// Initialize webhook handler
const handler = new OneDriveWebhookHandler(process.env.WEBHOOK_SECRET)

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
