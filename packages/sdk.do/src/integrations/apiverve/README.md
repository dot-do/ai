# Apiverve Integration

APIVerve offers a comprehensive suite of APIs designed to simplify integration processes, providing developers with scalable and reliable solutions for various applications.

**Category**: productivity
**Service**: Apiverve
**Base URL**: https://api.apiverve.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apiverve](https://integrations.do/apiverve)

## Installation

```bash
npm install @dotdo/integration-apiverve
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apiverve
```

## Quick Start

```typescript
import { ApiverveClient } from '@dotdo/integration-apiverve'

// Initialize client
const client = new ApiverveClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApiverveClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Apiverve actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApiverveError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApiverveError) {
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
