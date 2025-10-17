# Typeform Integration

Online form builder for surveys, quizzes, and data collection

**Category**: forms
**Service**: Typeform
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/typeform](https://integrations.do/typeform)

## Installation

```bash
npm install @dotdo/integration-typeform
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-typeform
```

## Quick Start

```typescript
import { TypeformClient } from '@dotdo/integration-typeform'

// Initialize client
const client = new TypeformClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TypeformClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Form

Create and manage forms

#### `form.create()`

```typescript
const result = await client.form.create({
  title: 'example', // Form title
  fields: [], // Form fields
  settings: {}, // Form settings
})
```

#### `form.get()`

```typescript
const result = await client.form.get({
  form_id: 'example', // Form ID
})
```

#### `form.update()`

```typescript
const result = await client.form.update({
  form_id: 'example', // Form ID
  title: 'example', // Updated form title
  fields: [], // Updated form fields
})
```

#### `form.delete()`

```typescript
const result = await client.form.delete({
  form_id: 'example', // Form ID
})
```

#### `form.list()`

```typescript
const result = await client.form.list({
  page: 123, // Page number
  page_size: 123, // Results per page
})
```

### Response

Retrieve and manage form responses

#### `response.get()`

```typescript
const result = await client.response.get({
  form_id: 'example', // Form ID
  response_id: 'example', // Response ID
})
```

#### `response.list()`

```typescript
const result = await client.response.list({
  form_id: 'example', // Form ID
  page_size: 123, // Results per page (max 1000)
  since: 'example', // Start date (ISO 8601)
  until: 'example', // End date (ISO 8601)
  after: 'example', // Response token for pagination
  before: 'example', // Response token for pagination
})
```

#### `response.delete()`

```typescript
const result = await client.response.delete({
  form_id: 'example', // Form ID
  included_response_ids: [], // Response IDs to delete
})
```

### Webhook

Create and manage webhooks

#### `webhook.create()`

```typescript
const result = await client.webhook.create({
  form_id: 'example', // Form ID
  tag: 'example', // Webhook tag/identifier
  url: 'example', // Webhook URL
  enabled: true, // Enable webhook
  secret: 'example', // Secret for signature verification
})
```

#### `webhook.get()`

```typescript
const result = await client.webhook.get({
  form_id: 'example', // Form ID
  tag: 'example', // Webhook tag
})
```

#### `webhook.delete()`

```typescript
const result = await client.webhook.delete({
  form_id: 'example', // Form ID
  tag: 'example', // Webhook tag
})
```

### Theme

Create and manage form themes

#### `theme.create()`

```typescript
const result = await client.theme.create({
  name: 'example', // Theme name
  colors: {}, // Theme colors
  font: 'example', // Theme font
})
```

#### `theme.get()`

```typescript
const result = await client.theme.get({
  theme_id: 'example', // Theme ID
})
```

#### `theme.update()`

```typescript
const result = await client.theme.update({
  theme_id: 'example', // Theme ID
  name: 'example', // Updated theme name
  colors: {}, // Updated theme colors
})
```

#### `theme.delete()`

```typescript
const result = await client.theme.delete({
  theme_id: 'example', // Theme ID
})
```

#### `theme.list()`

```typescript
const result = await client.theme.list({
  page: 123, // Page number
  page_size: 123, // Results per page
})
```

## Error Handling

All errors are thrown as `TypeformError` instances with additional metadata:

```typescript
try {
  const result = await client.form.list()
} catch (error) {
  if (error instanceof TypeformError) {
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
import { TypeformWebhookHandler, WebhookEventRouter } from '@dotdo/integration-typeform'

// Initialize webhook handler
const handler = new TypeformWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onFormResponse(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `form_response` - New form response submitted

## Rate Limits

This Integration enforces the following rate limits:

- **Per Second**: 2 requests

## License

MIT
