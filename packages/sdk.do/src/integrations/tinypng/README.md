# Tinypng Integration

TinyPNG uses smart lossy compression techniques to reduce the file size of your WebP, JPEG, and PNG files.

**Category**: productivity
**Service**: Tinypng
**Base URL**: https://api.tinypng.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tinypng](https://integrations.do/tinypng)

## Installation

```bash
npm install @dotdo/integration-tinypng
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tinypng
```

## Quick Start

```typescript
import { TinypngClient } from '@dotdo/integration-tinypng'

// Initialize client
const client = new TinypngClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new TinypngClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Tinypng actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TinypngError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TinypngError) {
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
