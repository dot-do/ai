# Precoro Integration

Precoro is a procurement software simplifying purchase order creation, approvals, and budget control, helping organizations manage sourcing and supplier relationships efficiently

**Category**: accounting
**Service**: Precoro
**Base URL**: https://api.precoro.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/precoro](https://integrations.do/precoro)

## Installation

```bash
npm install @dotdo/integration-precoro
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-precoro
```

## Quick Start

```typescript
import { PrecoroClient } from '@dotdo/integration-precoro'

// Initialize client
const client = new PrecoroClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PrecoroClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Precoro actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PrecoroError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PrecoroError) {
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
