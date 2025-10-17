# Coinbase Integration

Coinbase is a platform for buying, selling, transferring, and storing cryptocurrency.

**Category**: productivity
**Service**: Coinbase
**Base URL**: https://api.coinbase.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/coinbase](https://integrations.do/coinbase)

## Installation

```bash
npm install @dotdo/integration-coinbase
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-coinbase
```

## Quick Start

```typescript
import { CoinbaseClient } from '@dotdo/integration-coinbase'

// Initialize client
const client = new CoinbaseClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CoinbaseClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Coinbase actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CoinbaseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CoinbaseError) {
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
