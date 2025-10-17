# Sendloop Integration

Sendloop is an all-in-one email marketing solution for SaaS, e-commerce, application, and small business owners.

**Category**: productivity
**Service**: Sendloop
**Base URL**: https://api.sendloop.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sendloop](https://integrations.do/sendloop)

## Installation

```bash
npm install @dotdo/integration-sendloop
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sendloop
```

## Quick Start

```typescript
import { SendloopClient } from '@dotdo/integration-sendloop'

// Initialize client
const client = new SendloopClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SendloopClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Sendloop actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SendloopError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SendloopError) {
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
