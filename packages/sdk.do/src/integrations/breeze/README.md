# Breeze Integration

Breeze is a project management software that helps teams plan, track, and collaborate on projects efficiently.

**Category**: productivity
**Service**: Breeze
**Base URL**: https://api.breeze.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/breeze](https://integrations.do/breeze)

## Installation

```bash
npm install @dotdo/integration-breeze
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-breeze
```

## Quick Start

```typescript
import { BreezeClient } from '@dotdo/integration-breeze'

// Initialize client
const client = new BreezeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BreezeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Breeze actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BreezeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BreezeError) {
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
