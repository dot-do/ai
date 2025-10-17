# Perigon Integration

Perigon provides an HTTP REST API for retrieving news and web content data, offering structured data suitable for various applications.

**Category**: productivity
**Service**: Perigon
**Base URL**: https://api.perigon.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/perigon](https://integrations.do/perigon)

## Installation

```bash
npm install @dotdo/integration-perigon
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-perigon
```

## Quick Start

```typescript
import { PerigonClient } from '@dotdo/integration-perigon'

// Initialize client
const client = new PerigonClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PerigonClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Perigon actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PerigonError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PerigonError) {
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
