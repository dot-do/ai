# Pilvio Integration

Pilvio is a cloud service provider offering virtual machines, object storage, and full API support for resource management and automation.

**Category**: productivity
**Service**: Pilvio
**Base URL**: https://api.pilvio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pilvio](https://integrations.do/pilvio)

## Installation

```bash
npm install @dotdo/integration-pilvio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pilvio
```

## Quick Start

```typescript
import { PilvioClient } from '@dotdo/integration-pilvio'

// Initialize client
const client = new PilvioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PilvioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pilvio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PilvioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PilvioError) {
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
