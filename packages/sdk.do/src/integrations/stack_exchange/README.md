# Stack exchange Integration

Stack Exchange is a network of Q&A communities where users ask questions, share knowledge, and collaborate on topics like coding, math, and more

**Category**: communication
**Service**: StackExchange
**Base URL**: https://api.stack_exchange.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/stack_exchange](https://integrations.do/stack_exchange)

## Installation

```bash
npm install @dotdo/integration-stack_exchange
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-stack_exchange
```

## Quick Start

```typescript
import { StackExchangeClient } from '@dotdo/integration-stack_exchange'

// Initialize client
const client = new StackExchangeClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new StackExchangeClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Stack exchange actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `StackExchangeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof StackExchangeError) {
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
