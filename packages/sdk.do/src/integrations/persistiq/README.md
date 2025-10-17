# Persistiq Integration

PersistIQ is a sales automation platform that streamlines outbound sales processes with personalized email campaigns and task management.

**Category**: productivity
**Service**: Persistiq
**Base URL**: https://api.persistiq.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/persistiq](https://integrations.do/persistiq)

## Installation

```bash
npm install @dotdo/integration-persistiq
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-persistiq
```

## Quick Start

```typescript
import { PersistiqClient } from '@dotdo/integration-persistiq'

// Initialize client
const client = new PersistiqClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PersistiqClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Persistiq actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PersistiqError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PersistiqError) {
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
