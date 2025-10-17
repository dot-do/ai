# Pipedrive Integration

Pipedrive is a sales management tool built around pipeline visualization, lead tracking, activity reminders, and automation to keep deals progressing

**Category**: crm
**Service**: Pipedrive
**Base URL**: https://api.pipedrive.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pipedrive](https://integrations.do/pipedrive)

## Installation

```bash
npm install @dotdo/integration-pipedrive
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pipedrive
```

## Quick Start

```typescript
import { PipedriveClient } from '@dotdo/integration-pipedrive'

// Initialize client
const client = new PipedriveClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new PipedriveClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Pipedrive actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PipedriveError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PipedriveError) {
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
import { PipedriveWebhookHandler, WebhookEventRouter } from '@dotdo/integration-pipedrive'

// Initialize webhook handler
const handler = new PipedriveWebhookHandler(process.env.WEBHOOK_SECRET)

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
