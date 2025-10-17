# Ko fi Integration

Ko-fi is a platform that enables creators to receive support from their audience through donations, memberships, and sales.

**Category**: productivity
**Service**: KoFi
**Base URL**: https://api.ko_fi.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ko_fi](https://integrations.do/ko_fi)

## Installation

```bash
npm install @dotdo/integration-ko_fi
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ko_fi
```

## Quick Start

```typescript
import { KoFiClient } from '@dotdo/integration-ko_fi'

// Initialize client
const client = new KoFiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new KoFiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ko fi actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KoFiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KoFiError) {
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
