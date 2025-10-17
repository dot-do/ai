# Reply Integration

Reply.io is a sales engagement platform that automates multichannel outreach, enabling users to create and manage email campaigns, track replies, and monitor performance directly within their platform.

**Category**: productivity
**Service**: Reply
**Base URL**: https://api.reply.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/reply](https://integrations.do/reply)

## Installation

```bash
npm install @dotdo/integration-reply
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-reply
```

## Quick Start

```typescript
import { ReplyClient } from '@dotdo/integration-reply'

// Initialize client
const client = new ReplyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ReplyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Reply actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ReplyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ReplyError) {
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

## License

MIT
