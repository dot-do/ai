# Polygon Integration

Polygon.io provides real-time and historical market data APIs for stocks, options, forex, and cryptocurrencies.

**Category**: productivity
**Service**: Polygon
**Base URL**: https://api.polygon.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/polygon](https://integrations.do/polygon)

## Installation

```bash
npm install @dotdo/integration-polygon
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-polygon
```

## Quick Start

```typescript
import { PolygonClient } from '@dotdo/integration-polygon'

// Initialize client
const client = new PolygonClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PolygonClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Polygon actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PolygonError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PolygonError) {
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
