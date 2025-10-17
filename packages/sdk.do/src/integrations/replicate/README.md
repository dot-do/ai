# Replicate Integration

Replicate allows users to run AI models via a cloud API without managing infrastructure.

**Category**: productivity
**Service**: Replicate
**Base URL**: https://api.replicate.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/replicate](https://integrations.do/replicate)

## Installation

```bash
npm install @dotdo/integration-replicate
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-replicate
```

## Quick Start

```typescript
import { ReplicateClient } from '@dotdo/integration-replicate'

// Initialize client
const client = new ReplicateClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ReplicateClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Replicate actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ReplicateError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ReplicateError) {
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
