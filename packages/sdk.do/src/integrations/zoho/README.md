# Zoho Integration

Zoho is a suite of cloud applications including CRM, email marketing, and collaboration tools, enabling businesses to automate and scale operations

**Category**: crm
**Service**: Zoho
**Base URL**: https://api.zoho.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoho](https://integrations.do/zoho)

## Installation

```bash
npm install @dotdo/integration-zoho
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoho
```

## Quick Start

```typescript
import { ZohoClient } from '@dotdo/integration-zoho'

// Initialize client
const client = new ZohoClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ZohoClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Zoho actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZohoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZohoError) {
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
