# Twelve data Integration

Twelve Data provides a comprehensive financial data API offering real-time and historical market data for stocks, forex, cryptocurrencies, ETFs, and indices.

**Category**: productivity
**Service**: TwelveData
**Base URL**: https://api.twelve_data.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/twelve_data](https://integrations.do/twelve_data)

## Installation

```bash
npm install @dotdo/integration-twelve_data
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-twelve_data
```

## Quick Start

```typescript
import { TwelveDataClient } from '@dotdo/integration-twelve_data'

// Initialize client
const client = new TwelveDataClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TwelveDataClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Twelve data actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TwelveDataError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TwelveDataError) {
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
