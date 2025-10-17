# U301 Integration

U301 provides an API to manage all U301 resources, currently under development.

**Category**: productivity
**Service**: U301
**Base URL**: https://api.u301.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/u301](https://integrations.do/u301)

## Installation

```bash
npm install @dotdo/integration-u301
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-u301
```

## Quick Start

```typescript
import { U301Client } from '@dotdo/integration-u301'

// Initialize client
const client = new U301Client({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new U301Client({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute U301 actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `U301Error` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof U301Error) {
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
