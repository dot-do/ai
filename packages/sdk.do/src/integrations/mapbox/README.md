# Mapbox Integration

Mapbox is a platform that provides mapping, navigation, and location data services for developers to integrate into their applications.

**Category**: productivity
**Service**: Mapbox
**Base URL**: https://api.mapbox.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mapbox](https://integrations.do/mapbox)

## Installation

```bash
npm install @dotdo/integration-mapbox
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mapbox
```

## Quick Start

```typescript
import { MapboxClient } from '@dotdo/integration-mapbox'

// Initialize client
const client = new MapboxClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MapboxClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mapbox actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MapboxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MapboxError) {
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
