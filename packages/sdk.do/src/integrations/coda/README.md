# Coda Integration

Collaborative workspace platform that transforms documents into powerful tools for team productivity and project management

**Category**: productivity
**Service**: Coda
**Base URL**: https://api.coda.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/coda](https://integrations.do/coda)

## Installation

```bash
npm install @dotdo/integration-coda
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-coda
```

## Quick Start

```typescript
import { CodaClient } from '@dotdo/integration-coda'

// Initialize client
const client = new CodaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CodaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Coda actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CodaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CodaError) {
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
import { CodaWebhookHandler, WebhookEventRouter } from '@dotdo/integration-coda'

// Initialize webhook handler
const handler = new CodaWebhookHandler(process.env.WEBHOOK_SECRET)

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
