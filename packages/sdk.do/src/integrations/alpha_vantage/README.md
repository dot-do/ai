# Alpha vantage Integration

Alpha Vantage provides free APIs for real-time and historical financial data, including stock time series, technical indicators, and more.

**Category**: productivity
**Service**: AlphaVantage
**Base URL**: https://api.alpha_vantage.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/alpha_vantage](https://integrations.do/alpha_vantage)

## Installation

```bash
npm install @dotdo/integration-alpha_vantage
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-alpha_vantage
```

## Quick Start

```typescript
import { AlphaVantageClient } from '@dotdo/integration-alpha_vantage'

// Initialize client
const client = new AlphaVantageClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AlphaVantageClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Alpha vantage actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AlphaVantageError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AlphaVantageError) {
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
