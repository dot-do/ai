# Esignatures io Integration

eSignatures.io provides a platform for sending and signing mobile-friendly contracts over the web.

**Category**: productivity
**Service**: EsignaturesIo
**Base URL**: https://api.esignatures_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/esignatures_io](https://integrations.do/esignatures_io)

## Installation

```bash
npm install @dotdo/integration-esignatures_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-esignatures_io
```

## Quick Start

```typescript
import { EsignaturesIoClient } from '@dotdo/integration-esignatures_io'

// Initialize client
const client = new EsignaturesIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EsignaturesIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Esignatures io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EsignaturesIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EsignaturesIoError) {
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
