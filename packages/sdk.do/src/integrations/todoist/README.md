# Todoist Integration

Todoist is a task management tool allowing users to create to-do lists, set deadlines, and collaborate on projects with reminders and cross-platform syncing

**Category**: productivity
**Service**: Todoist
**Base URL**: https://api.todoist.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/todoist](https://integrations.do/todoist)

## Installation

```bash
npm install @dotdo/integration-todoist
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-todoist
```

## Quick Start

```typescript
import { TodoistClient } from '@dotdo/integration-todoist'

// Initialize client
const client = new TodoistClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TodoistClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Todoist actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TodoistError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TodoistError) {
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
import { TodoistWebhookHandler, WebhookEventRouter } from '@dotdo/integration-todoist'

// Initialize webhook handler
const handler = new TodoistWebhookHandler(process.env.WEBHOOK_SECRET)

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
