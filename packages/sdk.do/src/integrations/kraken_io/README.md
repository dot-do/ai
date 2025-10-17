# Kraken io Integration

Kraken.io is an image optimization and compression platform that helps reduce image file sizes without compromising quality.

**Category**: productivity
**Service**: KrakenIo
**Base URL**: https://api.kraken_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/kraken_io](https://integrations.do/kraken_io)

## Installation

```bash
npm install @dotdo/integration-kraken_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-kraken_io
```

## Quick Start

```typescript
import { KrakenIoClient } from '@dotdo/integration-kraken_io'

// Initialize client
const client = new KrakenIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new KrakenIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Kraken io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KrakenIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KrakenIoError) {
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
