# Gmail Integration

Gmail is Google’s email service, featuring spam protection, search functions, and seamless integration with other G Suite apps for productivity

**Category**: communication
**Service**: Gmail
**Base URL**: https://api.gmail.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gmail](https://integrations.do/gmail)

## Installation

```bash
npm install @dotdo/integration-gmail
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gmail
```

## Quick Start

```typescript
import { GmailClient } from '@dotdo/integration-gmail'

// Initialize client
const client = new GmailClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GmailClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Gmail actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GmailError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GmailError) {
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
import { GmailWebhookHandler, WebhookEventRouter } from '@dotdo/integration-gmail'

// Initialize webhook handler
const handler = new GmailWebhookHandler(process.env.WEBHOOK_SECRET)

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
