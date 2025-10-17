# Productboard Integration

Productboard is a product management platform that gathers feedback, prioritizes features, and aligns roadmaps based on customer insights and strategic goals

**Category**: productivity
**Service**: Productboard
**Base URL**: https://api.productboard.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/productboard](https://integrations.do/productboard)

## Installation

```bash
npm install @dotdo/integration-productboard
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-productboard
```

## Quick Start

```typescript
import { ProductboardClient } from '@dotdo/integration-productboard'

// Initialize client
const client = new ProductboardClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ProductboardClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Productboard actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ProductboardError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ProductboardError) {
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
