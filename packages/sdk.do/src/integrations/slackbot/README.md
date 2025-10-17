# Slackbot Integration

Slackbot automates responses and reminders within Slack, assisting with tasks like onboarding, FAQs, and notifications to streamline team productivity

**Category**: communication
**Service**: Slackbot
**Base URL**: https://api.slackbot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/slackbot](https://integrations.do/slackbot)

## Installation

```bash
npm install @dotdo/integration-slackbot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-slackbot
```

## Quick Start

```typescript
import { SlackbotClient } from '@dotdo/integration-slackbot'

// Initialize client
const client = new SlackbotClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SlackbotClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Slackbot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SlackbotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SlackbotError) {
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
import { SlackbotWebhookHandler, WebhookEventRouter } from '@dotdo/integration-slackbot'

// Initialize webhook handler
const handler = new SlackbotWebhookHandler(process.env.WEBHOOK_SECRET)

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
