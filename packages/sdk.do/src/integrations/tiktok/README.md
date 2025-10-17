# Tiktok Integration

TikTok short-form video platform + creation tools + social sharing

**Category**: productivity
**Service**: Tiktok
**Base URL**: https://api.tiktok.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tiktok](https://integrations.do/tiktok)

## Installation

```bash
npm install @dotdo/integration-tiktok
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tiktok
```

## Quick Start

```typescript
import { TiktokClient } from '@dotdo/integration-tiktok'

// Initialize client
const client = new TiktokClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TiktokClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Tiktok actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TiktokError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TiktokError) {
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
