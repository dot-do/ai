# Polygon io Integration

Polygon.io provides real-time and historical market data APIs for stocks, options, forex, and cryptocurrencies, enabling developers to build financial applications with ease.

**Category**: productivity
**Service**: PolygonIo
**Base URL**: https://api.polygon_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/polygon_io](https://integrations.do/polygon_io)

## Installation

```bash
npm install @dotdo/integration-polygon_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-polygon_io
```

## Quick Start

```typescript
import { PolygonIoClient } from '@dotdo/integration-polygon_io'

// Initialize client
const client = new PolygonIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PolygonIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Polygon io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PolygonIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PolygonIoError) {
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
