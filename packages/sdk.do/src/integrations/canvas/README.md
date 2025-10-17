# Canvas Integration

Canvas is a learning management system supporting online courses, assignments, grading, and collaboration, widely used by schools and universities for virtual classrooms

**Category**: productivity
**Service**: Canvas
**Base URL**: https://api.canvas.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/canvas](https://integrations.do/canvas)

## Installation

```bash
npm install @dotdo/integration-canvas
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-canvas
```

## Quick Start

```typescript
import { CanvasClient } from '@dotdo/integration-canvas'

// Initialize client
const client = new CanvasClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new CanvasClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Canvas actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CanvasError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CanvasError) {
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
import { CanvasWebhookHandler, WebhookEventRouter } from '@dotdo/integration-canvas'

// Initialize webhook handler
const handler = new CanvasWebhookHandler(process.env.WEBHOOK_SECRET)

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
