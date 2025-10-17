# Brevo Integration

Brevo (formerly Sendinblue) is an all-in-one email and SMS marketing platform that provides transactional messaging, marketing automation, contact management, and CRM tools to help businesses communicate and engage with their customers.

**Category**: productivity
**Service**: Brevo
**Base URL**: https://api.brevo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/brevo](https://integrations.do/brevo)

## Installation

```bash
npm install @dotdo/integration-brevo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-brevo
```

## Quick Start

```typescript
import { BrevoClient } from '@dotdo/integration-brevo'

// Initialize client
const client = new BrevoClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BrevoClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Brevo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrevoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrevoError) {
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
