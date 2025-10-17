# Cloudcart Integration

CloudCart is an e-commerce platform that enables businesses to create and manage online stores efficiently.

**Category**: ecommerce
**Service**: Cloudcart
**Base URL**: https://api.cloudcart.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cloudcart](https://integrations.do/cloudcart)

## Installation

```bash
npm install @dotdo/integration-cloudcart
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cloudcart
```

## Quick Start

```typescript
import { CloudcartClient } from '@dotdo/integration-cloudcart'

// Initialize client
const client = new CloudcartClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CloudcartClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cloudcart actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CloudcartError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CloudcartError) {
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
