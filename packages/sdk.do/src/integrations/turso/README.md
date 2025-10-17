# Turso Integration

Turso is a fully managed database platform built on libSQL, offering serverless SQLite databases with global replication and low-latency access.

**Category**: productivity
**Service**: Turso
**Base URL**: https://api.turso.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/turso](https://integrations.do/turso)

## Installation

```bash
npm install @dotdo/integration-turso
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-turso
```

## Quick Start

```typescript
import { TursoClient } from '@dotdo/integration-turso'

// Initialize client
const client = new TursoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TursoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Turso actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TursoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TursoError) {
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
