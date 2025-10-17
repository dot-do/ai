# Zoho mail Integration

Zoho Mail is a secure and ad-free email hosting platform with collaboration tools, calendar integration, and extensive administrative controls

**Category**: communication
**Service**: ZohoMail
**Base URL**: https://api.zoho_mail.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoho_mail](https://integrations.do/zoho_mail)

## Installation

```bash
npm install @dotdo/integration-zoho_mail
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoho_mail
```

## Quick Start

```typescript
import { ZohoMailClient } from '@dotdo/integration-zoho_mail'

// Initialize client
const client = new ZohoMailClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ZohoMailClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Zoho mail actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZohoMailError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZohoMailError) {
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
