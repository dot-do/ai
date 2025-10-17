# Short io Integration

Short.io is a URL shortening service that allows users to create branded short links, manage them, and track their performance.

**Category**: productivity
**Service**: ShortIo
**Base URL**: https://api.short_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/short_io](https://integrations.do/short_io)

## Installation

```bash
npm install @dotdo/integration-short_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-short_io
```

## Quick Start

```typescript
import { ShortIoClient } from '@dotdo/integration-short_io'

// Initialize client
const client = new ShortIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ShortIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Short io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ShortIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ShortIoError) {
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
