# Eversign Integration

Xodo Sign is a cloud-based digital signature solution that allows users to sign, send, and manage documents online.

**Category**: productivity
**Service**: Eversign
**Base URL**: https://api.eversign.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/eversign](https://integrations.do/eversign)

## Installation

```bash
npm install @dotdo/integration-eversign
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-eversign
```

## Quick Start

```typescript
import { EversignClient } from '@dotdo/integration-eversign'

// Initialize client
const client = new EversignClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EversignClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Eversign actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EversignError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EversignError) {
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
