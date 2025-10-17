# Piggy Integration

Piggy offers cashback and loyalty program integrations for online stores, letting users earn points or discounts and encouraging repeat purchases

**Category**: marketing
**Service**: Piggy
**Base URL**: https://api.piggy.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/piggy](https://integrations.do/piggy)

## Installation

```bash
npm install @dotdo/integration-piggy
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-piggy
```

## Quick Start

```typescript
import { PiggyClient } from '@dotdo/integration-piggy'

// Initialize client
const client = new PiggyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PiggyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Piggy actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PiggyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PiggyError) {
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
