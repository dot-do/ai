# Fireflies Integration

Fireflies.ai helps your team transcribe, summarize, search, and analyze voice conversations.

**Category**: analytics
**Service**: Fireflies
**Base URL**: https://api.fireflies.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/fireflies](https://integrations.do/fireflies)

## Installation

```bash
npm install @dotdo/integration-fireflies
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-fireflies
```

## Quick Start

```typescript
import { FirefliesClient } from '@dotdo/integration-fireflies'

// Initialize client
const client = new FirefliesClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FirefliesClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Fireflies actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FirefliesError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FirefliesError) {
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
import { FirefliesWebhookHandler, WebhookEventRouter } from '@dotdo/integration-fireflies'

// Initialize webhook handler
const handler = new FirefliesWebhookHandler(process.env.WEBHOOK_SECRET)

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
