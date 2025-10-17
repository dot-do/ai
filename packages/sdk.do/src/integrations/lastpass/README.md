# Lastpass Integration

LastPass is a password manager that securely stores credentials, autofills logins, and offers multi-factor authentication for personal and enterprise users

**Category**: productivity
**Service**: Lastpass
**Base URL**: https://api.lastpass.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/lastpass](https://integrations.do/lastpass)

## Installation

```bash
npm install @dotdo/integration-lastpass
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-lastpass
```

## Quick Start

```typescript
import { LastpassClient } from '@dotdo/integration-lastpass'

// Initialize client
const client = new LastpassClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new LastpassClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Lastpass actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LastpassError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LastpassError) {
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
