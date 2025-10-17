# Gong Integration

Gong is a platform for video meetings, call recording, and team collaboration.

**Category**: productivity
**Service**: Gong
**Base URL**: https://api.gong.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gong](https://integrations.do/gong)

## Installation

```bash
npm install @dotdo/integration-gong
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gong
```

## Quick Start

```typescript
import { GongClient } from '@dotdo/integration-gong'

// Initialize client
const client = new GongClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GongClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Gong actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GongError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GongError) {
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
