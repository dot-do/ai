# Chatfai Integration

ChatFAI is an AI-powered platform that enables users to engage in interactive conversations with AI-generated versions of their favorite fictional characters from various media.

**Category**: productivity
**Service**: Chatfai
**Base URL**: https://api.chatfai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/chatfai](https://integrations.do/chatfai)

## Installation

```bash
npm install @dotdo/integration-chatfai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-chatfai
```

## Quick Start

```typescript
import { ChatfaiClient } from '@dotdo/integration-chatfai'

// Initialize client
const client = new ChatfaiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ChatfaiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Chatfai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ChatfaiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ChatfaiError) {
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
