# Google Maps Integration

Integrate Google Maps to access location data, geocoding, directions, and mapping services in your application.

**Category**: productivity
**Service**: GoogleMaps
**Base URL**: https://api.google_maps.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/google_maps](https://integrations.do/google_maps)

## Installation

```bash
npm install @dotdo/integration-google_maps
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-google_maps
```

## Quick Start

```typescript
import { GoogleMapsClient } from '@dotdo/integration-google_maps'

// Initialize client
const client = new GoogleMapsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogleMapsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Maps actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogleMapsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogleMapsError) {
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
