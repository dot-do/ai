# Textit Integration

TextIt is a platform that enables users to build scalable, interactive chatbots across various channels without writing code.

**Category**: productivity
**Service**: Textit
**Base URL**: https://api.textit.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/textit](https://integrations.do/textit)

## Installation

```bash
npm install @dotdo/integration-textit
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-textit
```

## Quick Start

```typescript
import { TextitClient } from '@dotdo/integration-textit'

// Initialize client
const client = new TextitClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TextitClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Textit actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TextitError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TextitError) {
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
