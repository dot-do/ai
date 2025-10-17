# Geokeo Integration

Geokeo provides geocoding services, converting addresses to coordinates and vice versa, with a free tier offering 2,500 daily API requests.

**Category**: productivity
**Service**: Geokeo
**Base URL**: https://api.geokeo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/geokeo](https://integrations.do/geokeo)

## Installation

```bash
npm install @dotdo/integration-geokeo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-geokeo
```

## Quick Start

```typescript
import { GeokeoClient } from '@dotdo/integration-geokeo'

// Initialize client
const client = new GeokeoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GeokeoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Geokeo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GeokeoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GeokeoError) {
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
