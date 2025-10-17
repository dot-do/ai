# Sympla Integration

Sympla is a platform for managing both in-person and online events, offering tools for ticket sales, registrations, and digital content broadcasting.

**Category**: productivity
**Service**: Sympla
**Base URL**: https://api.sympla.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sympla](https://integrations.do/sympla)

## Installation

```bash
npm install @dotdo/integration-sympla
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sympla
```

## Quick Start

```typescript
import { SymplaClient } from '@dotdo/integration-sympla'

// Initialize client
const client = new SymplaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SymplaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sympla actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SymplaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SymplaError) {
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
