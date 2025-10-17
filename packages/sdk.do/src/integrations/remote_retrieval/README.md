# Remote retrieval Integration

Remote Retrieval automates the logistics of managing equipment returns, providing efficient tracking and management of laptop and monitor returns.

**Category**: productivity
**Service**: RemoteRetrieval
**Base URL**: https://api.remote_retrieval.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/remote_retrieval](https://integrations.do/remote_retrieval)

## Installation

```bash
npm install @dotdo/integration-remote_retrieval
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-remote_retrieval
```

## Quick Start

```typescript
import { RemoteRetrievalClient } from '@dotdo/integration-remote_retrieval'

// Initialize client
const client = new RemoteRetrievalClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RemoteRetrievalClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Remote retrieval actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RemoteRetrievalError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RemoteRetrievalError) {
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
