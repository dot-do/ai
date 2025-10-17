# Kaleido Integration

Kaleido is a full-stack platform for building and managing enterprise blockchain networks and applications.

**Category**: productivity
**Service**: Kaleido
**Base URL**: https://api.kaleido.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/kaleido](https://integrations.do/kaleido)

## Installation

```bash
npm install @dotdo/integration-kaleido
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-kaleido
```

## Quick Start

```typescript
import { KaleidoClient } from '@dotdo/integration-kaleido'

// Initialize client
const client = new KaleidoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new KaleidoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Kaleido actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KaleidoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KaleidoError) {
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
