# Radar Integration

Radar is a full-stack location infrastructure platform offering SDKs and APIs for geofencing, location tracking, geocoding, search, routing, and maps.

**Category**: productivity
**Service**: Radar
**Base URL**: https://api.radar.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/radar](https://integrations.do/radar)

## Installation

```bash
npm install @dotdo/integration-radar
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-radar
```

## Quick Start

```typescript
import { RadarClient } from '@dotdo/integration-radar'

// Initialize client
const client = new RadarClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RadarClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Radar actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RadarError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RadarError) {
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
