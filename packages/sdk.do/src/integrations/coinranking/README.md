# Coinranking Integration

Coinranking provides a comprehensive API for accessing cryptocurrency market data, including coin prices, market caps, and historical data.

**Category**: productivity
**Service**: Coinranking
**Base URL**: https://api.coinranking.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/coinranking](https://integrations.do/coinranking)

## Installation

```bash
npm install @dotdo/integration-coinranking
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-coinranking
```

## Quick Start

```typescript
import { CoinrankingClient } from '@dotdo/integration-coinranking'

// Initialize client
const client = new CoinrankingClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CoinrankingClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Coinranking actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CoinrankingError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CoinrankingError) {
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
