# Tomtom Integration

TomTom provides a suite of location-based services and APIs, including mapping, routing, traffic information, and geofencing, enabling developers to integrate advanced navigation and location functionalities into their applications.

**Category**: productivity
**Service**: Tomtom
**Base URL**: https://api.tomtom.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tomtom](https://integrations.do/tomtom)

## Installation

```bash
npm install @dotdo/integration-tomtom
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tomtom
```

## Quick Start

```typescript
import { TomtomClient } from '@dotdo/integration-tomtom'

// Initialize client
const client = new TomtomClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TomtomClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Tomtom actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TomtomError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TomtomError) {
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
