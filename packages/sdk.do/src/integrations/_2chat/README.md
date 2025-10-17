# 2chat Integration

2Chat provides a programmable API for integrating WhatsApp and other text channels, enabling developers to send and receive messages, manage groups, and automate workflows.

**Category**: productivity
**Service**: 2chat
**Base URL**: https://api.\_2chat.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/\_2chat](https://integrations.do/_2chat)

## Installation

```bash
npm install @dotdo/integration-_2chat
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-_2chat
```

## Quick Start

```typescript
import { 2chatClient } from '@dotdo/integration-_2chat'

// Initialize client
const client = new 2chatClient({
  apiKey: 'your-api-key',
})

```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new 2chatClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute 2chat actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `2chatError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof 2chatError) {
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
