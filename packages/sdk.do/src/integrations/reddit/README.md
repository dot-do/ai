# Reddit Integration

Reddit is a social news platform with user-driven communities (subreddits), offering content sharing, discussions, and viral marketing opportunities for brands

**Category**: marketing
**Service**: Reddit
**Base URL**: https://api.reddit.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/reddit](https://integrations.do/reddit)

## Installation

```bash
npm install @dotdo/integration-reddit
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-reddit
```

## Quick Start

```typescript
import { RedditClient } from '@dotdo/integration-reddit'

// Initialize client
const client = new RedditClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new RedditClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Reddit actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RedditError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RedditError) {
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
