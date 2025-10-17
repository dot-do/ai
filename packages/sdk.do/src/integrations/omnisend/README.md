# Omnisend Integration

Omnisend is a marketing automation platform for ecommerce businesses, focusing on email and SMS marketing.

**Category**: productivity
**Service**: Omnisend
**Base URL**: https://api.omnisend.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/omnisend](https://integrations.do/omnisend)

## Installation

```bash
npm install @dotdo/integration-omnisend
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-omnisend
```

## Quick Start

```typescript
import { OmnisendClient } from '@dotdo/integration-omnisend'

// Initialize client
const client = new OmnisendClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new OmnisendClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Omnisend actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OmnisendError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OmnisendError) {
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
