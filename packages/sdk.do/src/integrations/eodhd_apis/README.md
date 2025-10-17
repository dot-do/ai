# Eodhd apis Integration

EODHD APIs provide comprehensive financial data, including historical stock market data, live stock prices, fundamental data, and more, accessible via REST and WebSocket APIs.

**Category**: productivity
**Service**: EodhdApis
**Base URL**: https://api.eodhd_apis.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/eodhd_apis](https://integrations.do/eodhd_apis)

## Installation

```bash
npm install @dotdo/integration-eodhd_apis
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-eodhd_apis
```

## Quick Start

```typescript
import { EodhdApisClient } from '@dotdo/integration-eodhd_apis'

// Initialize client
const client = new EodhdApisClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EodhdApisClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Eodhd apis actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EodhdApisError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EodhdApisError) {
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
