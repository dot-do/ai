# Geocodio Integration

Geocodio provides straightforward and easy-to-use geocoding, reverse geocoding, and data matching services for US and Canadian addresses.

**Category**: productivity
**Service**: Geocodio
**Base URL**: https://api.geocodio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/geocodio](https://integrations.do/geocodio)

## Installation

```bash
npm install @dotdo/integration-geocodio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-geocodio
```

## Quick Start

```typescript
import { GeocodioClient } from '@dotdo/integration-geocodio'

// Initialize client
const client = new GeocodioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GeocodioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Geocodio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GeocodioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GeocodioError) {
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
