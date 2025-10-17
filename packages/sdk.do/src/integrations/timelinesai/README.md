# Timelinesai Integration

TimelinesAI enables teams to manage and automate WhatsApp communications, integrating with various CRMs and tools to streamline workflows.

**Category**: productivity
**Service**: Timelinesai
**Base URL**: https://api.timelinesai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/timelinesai](https://integrations.do/timelinesai)

## Installation

```bash
npm install @dotdo/integration-timelinesai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-timelinesai
```

## Quick Start

```typescript
import { TimelinesaiClient } from '@dotdo/integration-timelinesai'

// Initialize client
const client = new TimelinesaiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TimelinesaiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Timelinesai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TimelinesaiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TimelinesaiError) {
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
import { TimelinesaiWebhookHandler, WebhookEventRouter } from '@dotdo/integration-timelinesai'

// Initialize webhook handler
const handler = new TimelinesaiWebhookHandler(process.env.WEBHOOK_SECRET)

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
