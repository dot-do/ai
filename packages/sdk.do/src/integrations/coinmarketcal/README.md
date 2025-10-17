# Coinmarketcal Integration

CoinMarketCal is a community-driven crypto calendar, highlighting upcoming events, announcements, and releases, helping traders and enthusiasts track market-impacting developments in the cryptocurrency space

**Category**: productivity
**Service**: Coinmarketcal
**Base URL**: https://api.coinmarketcal.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/coinmarketcal](https://integrations.do/coinmarketcal)

## Installation

```bash
npm install @dotdo/integration-coinmarketcal
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-coinmarketcal
```

## Quick Start

```typescript
import { CoinmarketcalClient } from '@dotdo/integration-coinmarketcal'

// Initialize client
const client = new CoinmarketcalClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CoinmarketcalClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Coinmarketcal actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CoinmarketcalError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CoinmarketcalError) {
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
