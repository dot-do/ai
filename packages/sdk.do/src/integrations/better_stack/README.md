# Better stack Integration

Better Stack provides monitoring, logging, and incident management solutions to help teams ensure the reliability and performance of their applications.

**Category**: productivity
**Service**: BetterStack
**Base URL**: https://api.better_stack.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/better_stack](https://integrations.do/better_stack)

## Installation

```bash
npm install @dotdo/integration-better_stack
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-better_stack
```

## Quick Start

```typescript
import { BetterStackClient } from '@dotdo/integration-better_stack'

// Initialize client
const client = new BetterStackClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BetterStackClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Better stack actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BetterStackError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BetterStackError) {
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
