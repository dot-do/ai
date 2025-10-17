# Linkup Integration

Search the Web for Relevant Results (RAG Use Case)

**Category**: productivity
**Service**: Linkup
**Base URL**: https://api.linkup.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/linkup](https://integrations.do/linkup)

## Installation

```bash
npm install @dotdo/integration-linkup
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-linkup
```

## Quick Start

```typescript
import { LinkupClient } from '@dotdo/integration-linkup'

// Initialize client
const client = new LinkupClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LinkupClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Linkup actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LinkupError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LinkupError) {
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
