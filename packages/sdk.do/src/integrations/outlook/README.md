# Outlook Integration

Outlook is Microsoft’s email and calendaring platform integrating contacts, tasks, and scheduling, enabling users to manage communications and events in a unified workspace

**Category**: communication
**Service**: Outlook
**Base URL**: https://api.outlook.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/outlook](https://integrations.do/outlook)

## Installation

```bash
npm install @dotdo/integration-outlook
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-outlook
```

## Quick Start

```typescript
import { OutlookClient } from '@dotdo/integration-outlook'

// Initialize client
const client = new OutlookClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new OutlookClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Outlook actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OutlookError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OutlookError) {
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
import { OutlookWebhookHandler, WebhookEventRouter } from '@dotdo/integration-outlook'

// Initialize webhook handler
const handler = new OutlookWebhookHandler(process.env.WEBHOOK_SECRET)

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
