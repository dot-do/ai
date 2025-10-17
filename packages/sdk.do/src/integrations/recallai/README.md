# Recallai Integration

The universal API for meeting bots & conversation data.

**Category**: accounting
**Service**: Recallai
**Base URL**: https://api.recallai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/recallai](https://integrations.do/recallai)

## Installation

```bash
npm install @dotdo/integration-recallai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-recallai
```

## Quick Start

```typescript
import { RecallaiClient } from '@dotdo/integration-recallai'

// Initialize client
const client = new RecallaiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RecallaiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Recallai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RecallaiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RecallaiError) {
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
