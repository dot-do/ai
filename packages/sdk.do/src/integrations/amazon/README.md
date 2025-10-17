# Amazon Integration

Amazon is an e-commerce giant delivering a massive online marketplace, cloud services, and digital products that connect retailers, consumers, and businesses worldwide for seamless transactions

**Category**: ecommerce
**Service**: Amazon
**Base URL**: https://api.amazon.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/amazon](https://integrations.do/amazon)

## Installation

```bash
npm install @dotdo/integration-amazon
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-amazon
```

## Quick Start

```typescript
import { AmazonClient } from '@dotdo/integration-amazon'

// Initialize client
const client = new AmazonClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new AmazonClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Amazon actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AmazonError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AmazonError) {
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
