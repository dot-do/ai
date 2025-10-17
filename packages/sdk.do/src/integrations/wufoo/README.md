# Wufoo Integration

Online form builder and data collection platform

**Category**: forms
**Service**: Wufoo
**Base URL**: https://{subdomain}.wufoo.com/api/v3

This Integration is auto-generated from MDXLD definition: [https://integrations.do/wufoo](https://integrations.do/wufoo)

## Installation

```bash
npm install @dotdo/integration-wufoo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-wufoo
```

## Quick Start

```typescript
import { WufooClient } from '@dotdo/integration-wufoo'

// Initialize client
const client = new WufooClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WufooClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Form

Access form definitions

#### `form.get()`

```typescript
const result = await client.form.get({
  form_id: 'example', // Form ID
})
```

#### `form.list()`

```typescript
const result = await client.form.list()
```

### Entry

Access form submissions

#### `entry.get()`

```typescript
const result = await client.entry.get({
  form_id: 'example', // Form ID
  entry_id: 'example', // Entry ID
})
```

#### `entry.list()`

```typescript
const result = await client.entry.list({
  form_id: 'example', // Form ID
})
```

#### `entry.create()`

```typescript
const result = await client.entry.create({
  form_id: 'example', // Form ID
  fields: {}, // Form field values
})
```

## Error Handling

All errors are thrown as `WufooError` instances with additional metadata:

```typescript
try {
  const result = await client.form.list()
} catch (error) {
  if (error instanceof WufooError) {
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
import { WufooWebhookHandler, WebhookEventRouter } from '@dotdo/integration-wufoo'

// Initialize webhook handler
const handler = new WufooWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onEntryCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `entry_created` - New form entry created

## License

MIT
