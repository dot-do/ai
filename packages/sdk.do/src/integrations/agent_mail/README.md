# Agent mail Integration

AgentMail provides AI agents with their own email inboxes, enabling them to send, receive, and act upon emails for communication with services, people, and other agents.

**Category**: communication
**Service**: AgentMail
**Base URL**: https://api.agent_mail.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/agent_mail](https://integrations.do/agent_mail)

## Installation

```bash
npm install @dotdo/integration-agent_mail
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-agent_mail
```

## Quick Start

```typescript
import { AgentMailClient } from '@dotdo/integration-agent_mail'

// Initialize client
const client = new AgentMailClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AgentMailClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Agent mail actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AgentMailError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AgentMailError) {
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
import { AgentMailWebhookHandler, WebhookEventRouter } from '@dotdo/integration-agent_mail'

// Initialize webhook handler
const handler = new AgentMailWebhookHandler(process.env.WEBHOOK_SECRET)

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
