# Payhip Integration

Payhip is an e-commerce platform that enables individuals and businesses to sell digital products, memberships, and physical goods directly to their audience.

**Category**: ecommerce
**Service**: Payhip
**Base URL**: https://api.payhip.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/payhip](https://integrations.do/payhip)

## Installation

```bash
npm install @dotdo/integration-payhip
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-payhip
```

## Quick Start

```typescript
import { PayhipClient } from '@dotdo/integration-payhip'

// Initialize client
const client = new PayhipClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PayhipClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Payhip actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PayhipError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PayhipError) {
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
