# Facebook Integration

Facebook is a social media and advertising platform used by individuals and businesses to connect, share content, and promote products or services. Only supports Facebook Pages, not Facebook Personal accounts.

**Category**: marketing
**Service**: Facebook
**Base URL**: https://api.facebook.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/facebook](https://integrations.do/facebook)

## Installation

```bash
npm install @dotdo/integration-facebook
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-facebook
```

## Quick Start

```typescript
import { FacebookClient } from '@dotdo/integration-facebook'

// Initialize client
const client = new FacebookClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new FacebookClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Facebook actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FacebookError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FacebookError) {
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
