# Chatbotkit Integration

ChatBotKit is a platform that enables developers to build and manage AI-powered chatbots, offering comprehensive APIs and SDKs for seamless integration into applications.

**Category**: productivity
**Service**: Chatbotkit
**Base URL**: https://api.chatbotkit.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/chatbotkit](https://integrations.do/chatbotkit)

## Installation

```bash
npm install @dotdo/integration-chatbotkit
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-chatbotkit
```

## Quick Start

```typescript
import { ChatbotkitClient } from '@dotdo/integration-chatbotkit'

// Initialize client
const client = new ChatbotkitClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ChatbotkitClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Chatbotkit actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ChatbotkitError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ChatbotkitError) {
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
