# Basin Integration

Basin is a no-code form backend that enables users to set up powerful, reliable forms quickly without writing server-side code.

**Category**: productivity
**Service**: Basin
**Base URL**: https://api.basin.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/basin](https://integrations.do/basin)

## Installation

```bash
npm install @dotdo/integration-basin
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-basin
```

## Quick Start

```typescript
import { BasinClient } from '@dotdo/integration-basin'

// Initialize client
const client = new BasinClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BasinClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Basin actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BasinError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BasinError) {
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
