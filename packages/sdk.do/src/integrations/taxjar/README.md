# Taxjar Integration

TaxJar provides a comprehensive sales tax API for real-time tax calculations, reporting, and filing.

**Category**: productivity
**Service**: Taxjar
**Base URL**: https://api.taxjar.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/taxjar](https://integrations.do/taxjar)

## Installation

```bash
npm install @dotdo/integration-taxjar
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-taxjar
```

## Quick Start

```typescript
import { TaxjarClient } from '@dotdo/integration-taxjar'

// Initialize client
const client = new TaxjarClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TaxjarClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Taxjar actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TaxjarError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TaxjarError) {
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
