# Finage Integration

Finage provides secure RESTful APIs for real-time and historical financial market data covering stocks, forex, cryptocurrencies, indices, ETFs, and commodities.

**Category**: productivity
**Service**: Finage
**Base URL**: https://api.finage.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/finage](https://integrations.do/finage)

## Installation

```bash
npm install @dotdo/integration-finage
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-finage
```

## Quick Start

```typescript
import { FinageClient } from '@dotdo/integration-finage'

// Initialize client
const client = new FinageClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FinageClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Finage actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FinageError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FinageError) {
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
