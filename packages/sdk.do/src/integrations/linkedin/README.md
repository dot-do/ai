# Linkedin Integration

LinkedIn is a professional networking platform enabling job seekers, companies, and thought leaders to connect, share content, and discover business opportunities

**Category**: marketing
**Service**: Linkedin
**Base URL**: https://api.linkedin.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/linkedin](https://integrations.do/linkedin)

## Installation

```bash
npm install @dotdo/integration-linkedin
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-linkedin
```

## Quick Start

```typescript
import { LinkedinClient } from '@dotdo/integration-linkedin'

// Initialize client
const client = new LinkedinClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new LinkedinClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Linkedin actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LinkedinError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LinkedinError) {
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
