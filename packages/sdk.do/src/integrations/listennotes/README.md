# Listennotes Integration

The best podcast search engine.

**Category**: productivity
**Service**: Listennotes
**Base URL**: https://api.listennotes.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/listennotes](https://integrations.do/listennotes)

## Installation

```bash
npm install @dotdo/integration-listennotes
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-listennotes
```

## Quick Start

```typescript
import { ListennotesClient } from '@dotdo/integration-listennotes'

// Initialize client
const client = new ListennotesClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ListennotesClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Listennotes actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ListennotesError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ListennotesError) {
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
