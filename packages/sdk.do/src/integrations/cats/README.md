# Cats Integration

An API providing access to a vast collection of cat images, breeds, and facts.

**Category**: productivity
**Service**: Cats
**Base URL**: https://api.cats.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cats](https://integrations.do/cats)

## Installation

```bash
npm install @dotdo/integration-cats
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cats
```

## Quick Start

```typescript
import { CatsClient } from '@dotdo/integration-cats'

// Initialize client
const client = new CatsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CatsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cats actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CatsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CatsError) {
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
