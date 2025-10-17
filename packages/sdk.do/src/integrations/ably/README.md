# Ably Integration

Ably is a real-time messaging platform helping developers build live features, including chat and data synchronization, with global scalability and robust reliability for modern applications

**Category**: developer-tools
**Service**: Ably
**Base URL**: https://api.ably.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ably](https://integrations.do/ably)

## Installation

```bash
npm install @dotdo/integration-ably
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ably
```

## Quick Start

```typescript
import { AblyClient } from '@dotdo/integration-ably'

// Initialize client
const client = new AblyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AblyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ably actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AblyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AblyError) {
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
