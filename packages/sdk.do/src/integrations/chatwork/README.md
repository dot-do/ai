# Chatwork Integration

Chatwork is a team communication platform featuring group chats, file sharing, and task management, aiming to enhance collaboration and productivity for businesses

**Category**: communication
**Service**: Chatwork
**Base URL**: https://api.chatwork.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/chatwork](https://integrations.do/chatwork)

## Installation

```bash
npm install @dotdo/integration-chatwork
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-chatwork
```

## Quick Start

```typescript
import { ChatworkClient } from '@dotdo/integration-chatwork'

// Initialize client
const client = new ChatworkClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ChatworkClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Chatwork actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ChatworkError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ChatworkError) {
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
