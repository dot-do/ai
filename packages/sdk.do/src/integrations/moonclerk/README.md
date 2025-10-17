# Moonclerk Integration

MoonClerk is a platform that enables businesses to accept recurring and one-time online payments.

**Category**: productivity
**Service**: Moonclerk
**Base URL**: https://api.moonclerk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/moonclerk](https://integrations.do/moonclerk)

## Installation

```bash
npm install @dotdo/integration-moonclerk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-moonclerk
```

## Quick Start

```typescript
import { MoonclerkClient } from '@dotdo/integration-moonclerk'

// Initialize client
const client = new MoonclerkClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MoonclerkClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Moonclerk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MoonclerkError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MoonclerkError) {
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
