# Ip2location io Integration

IP2Location.io provides a fast and accurate IP Geolocation API tool to determine a user's location and use the geolocation information in different use cases.

**Category**: productivity
**Service**: Ip2locationIo
**Base URL**: https://api.ip2location_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ip2location_io](https://integrations.do/ip2location_io)

## Installation

```bash
npm install @dotdo/integration-ip2location_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ip2location_io
```

## Quick Start

```typescript
import { Ip2locationIoClient } from '@dotdo/integration-ip2location_io'

// Initialize client
const client = new Ip2locationIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Ip2locationIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ip2location io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Ip2locationIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Ip2locationIoError) {
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
