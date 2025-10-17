# Netsuite Integration

NetSuite by Oracle is a cloud-based ERP suite that combines accounting, CRM, e-commerce, and inventory management for comprehensive business oversight

**Category**: accounting
**Service**: Netsuite
**Base URL**: https://api.netsuite.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/netsuite](https://integrations.do/netsuite)

## Installation

```bash
npm install @dotdo/integration-netsuite
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-netsuite
```

## Quick Start

```typescript
import { NetsuiteClient } from '@dotdo/integration-netsuite'

// Initialize client
const client = new NetsuiteClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new NetsuiteClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Netsuite actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NetsuiteError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NetsuiteError) {
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
