# Stormglass io Integration

stormglass.io provides a global weather API offering high-resolution forecasts and historical data from trusted meteorological institutions.

**Category**: productivity
**Service**: StormglassIo
**Base URL**: https://api.stormglass_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/stormglass_io](https://integrations.do/stormglass_io)

## Installation

```bash
npm install @dotdo/integration-stormglass_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-stormglass_io
```

## Quick Start

```typescript
import { StormglassIoClient } from '@dotdo/integration-stormglass_io'

// Initialize client
const client = new StormglassIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new StormglassIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Stormglass io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `StormglassIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof StormglassIoError) {
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
