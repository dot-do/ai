# Coinmarketcap Integration

CoinMarketCap provides a comprehensive cryptocurrency market data API, offering real-time and historical data on cryptocurrencies and exchanges.

**Category**: productivity
**Service**: Coinmarketcap
**Base URL**: https://api.coinmarketcap.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/coinmarketcap](https://integrations.do/coinmarketcap)

## Installation

```bash
npm install @dotdo/integration-coinmarketcap
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-coinmarketcap
```

## Quick Start

```typescript
import { CoinmarketcapClient } from '@dotdo/integration-coinmarketcap'

// Initialize client
const client = new CoinmarketcapClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CoinmarketcapClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Coinmarketcap actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CoinmarketcapError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CoinmarketcapError) {
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
