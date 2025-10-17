# Zoho bigin Integration

Zoho Bigin is a simplified CRM solution from Zoho tailored for small businesses, focusing on pipeline tracking and relationship management

**Category**: crm
**Service**: ZohoBigin
**Base URL**: https://api.zoho_bigin.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoho_bigin](https://integrations.do/zoho_bigin)

## Installation

```bash
npm install @dotdo/integration-zoho_bigin
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoho_bigin
```

## Quick Start

```typescript
import { ZohoBiginClient } from '@dotdo/integration-zoho_bigin'

// Initialize client
const client = new ZohoBiginClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ZohoBiginClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Zoho bigin actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZohoBiginError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZohoBiginError) {
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
