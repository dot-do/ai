# Vero Integration

Vero is a customer messaging platform that personalizes email, push notifications, and webhooks to build targeted campaigns and user journeys

**Category**: marketing
**Service**: Vero
**Base URL**: https://api.vero.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/vero](https://integrations.do/vero)

## Installation

```bash
npm install @dotdo/integration-vero
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-vero
```

## Quick Start

```typescript
import { VeroClient } from '@dotdo/integration-vero'

// Initialize client
const client = new VeroClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new VeroClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Vero actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `VeroError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof VeroError) {
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
