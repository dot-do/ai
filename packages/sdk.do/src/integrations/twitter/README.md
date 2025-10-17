# Twitter Integration

Twitter, Inc. was an American social media company based in San Francisco, California, which operated and was named for named for its flagship social media network prior to its rebrand as X.

**Category**: social-media
**Service**: Twitter
**Base URL**: https://api.twitter.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/twitter](https://integrations.do/twitter)

## Installation

```bash
npm install @dotdo/integration-twitter
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-twitter
```

## Quick Start

```typescript
import { TwitterClient } from '@dotdo/integration-twitter'

// Initialize client
const client = new TwitterClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TwitterClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Twitter actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TwitterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TwitterError) {
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
