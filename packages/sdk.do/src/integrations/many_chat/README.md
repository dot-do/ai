# Many chat Integration

ManyChat is a platform that enables businesses to automate interactive conversations across various messaging channels, including Instagram Direct Messages, Facebook Messenger, and SMS, to enhance customer engagement and drive growth.

**Category**: productivity
**Service**: ManyChat
**Base URL**: https://api.many_chat.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/many_chat](https://integrations.do/many_chat)

## Installation

```bash
npm install @dotdo/integration-many_chat
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-many_chat
```

## Quick Start

```typescript
import { ManyChatClient } from '@dotdo/integration-many_chat'

// Initialize client
const client = new ManyChatClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ManyChatClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Many chat actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ManyChatError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ManyChatError) {
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
