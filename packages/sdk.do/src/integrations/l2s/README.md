# L2s Integration

L2S is a professional URL shortener offering advanced analytics, QR code generation, and team collaboration features.

**Category**: productivity
**Service**: L2s
**Base URL**: https://api.l2s.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/l2s](https://integrations.do/l2s)

## Installation

```bash
npm install @dotdo/integration-l2s
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-l2s
```

## Quick Start

```typescript
import { L2sClient } from '@dotdo/integration-l2s'

// Initialize client
const client = new L2sClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new L2sClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute L2s actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `L2sError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof L2sError) {
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
