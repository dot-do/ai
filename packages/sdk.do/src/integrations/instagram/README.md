# Instagram Integration

Instagram is a social media platform for sharing photos, videos, and stories. Only supports Instagram Business and Creator accounts, not Instagram Personal accounts.

**Category**: productivity
**Service**: Instagram
**Base URL**: https://api.instagram.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/instagram](https://integrations.do/instagram)

## Installation

```bash
npm install @dotdo/integration-instagram
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-instagram
```

## Quick Start

```typescript
import { InstagramClient } from '@dotdo/integration-instagram'

// Initialize client
const client = new InstagramClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new InstagramClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Instagram actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `InstagramError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof InstagramError) {
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
