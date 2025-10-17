# Kadoa Integration

Kadoa is an API-first platform that enables users to create, manage, and monitor data extraction workflows from unstructured data sources.

**Category**: productivity
**Service**: Kadoa
**Base URL**: https://api.kadoa.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/kadoa](https://integrations.do/kadoa)

## Installation

```bash
npm install @dotdo/integration-kadoa
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-kadoa
```

## Quick Start

```typescript
import { KadoaClient } from '@dotdo/integration-kadoa'

// Initialize client
const client = new KadoaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new KadoaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Kadoa actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KadoaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KadoaError) {
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
