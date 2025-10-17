# Google Sheets Integration

Google Sheets is a cloud-based spreadsheet tool enabling real-time collaboration, data analysis, and integration with other Google Workspace apps

**Category**: productivity
**Service**: Googlesheets
**Base URL**: https://api.googlesheets.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googlesheets](https://integrations.do/googlesheets)

## Installation

```bash
npm install @dotdo/integration-googlesheets
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googlesheets
```

## Quick Start

```typescript
import { GooglesheetsClient } from '@dotdo/integration-googlesheets'

// Initialize client
const client = new GooglesheetsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GooglesheetsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Sheets actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GooglesheetsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GooglesheetsError) {
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
import { GooglesheetsWebhookHandler, WebhookEventRouter } from '@dotdo/integration-googlesheets'

// Initialize webhook handler
const handler = new GooglesheetsWebhookHandler(process.env.WEBHOOK_SECRET)

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
