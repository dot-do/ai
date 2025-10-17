# Bestbuy Integration

Best Buy offers a suite of APIs providing access to product, store, category, and recommendation data.

**Category**: productivity
**Service**: Bestbuy
**Base URL**: https://api.bestbuy.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bestbuy](https://integrations.do/bestbuy)

## Installation

```bash
npm install @dotdo/integration-bestbuy
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bestbuy
```

## Quick Start

```typescript
import { BestbuyClient } from '@dotdo/integration-bestbuy'

// Initialize client
const client = new BestbuyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BestbuyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bestbuy actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BestbuyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BestbuyError) {
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
