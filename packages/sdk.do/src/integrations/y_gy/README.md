# Y gy Integration

y.gy is a URL shortener and QR code generator that allows users to create short, memorable links from long URLs, customize them with unique endings, and integrate with an API for programmatic link creation.

**Category**: productivity
**Service**: YGy
**Base URL**: https://api.y_gy.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/y_gy](https://integrations.do/y_gy)

## Installation

```bash
npm install @dotdo/integration-y_gy
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-y_gy
```

## Quick Start

```typescript
import { YGyClient } from '@dotdo/integration-y_gy'

// Initialize client
const client = new YGyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new YGyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Y gy actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `YGyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof YGyError) {
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
