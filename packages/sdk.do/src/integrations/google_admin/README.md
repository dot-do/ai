# Google Admin Integration

Google Admin Console for managing Google Workspace users, groups, and organizational units.

**Category**: productivity
**Service**: GoogleAdmin
**Base URL**: https://api.google_admin.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/google_admin](https://integrations.do/google_admin)

## Installation

```bash
npm install @dotdo/integration-google_admin
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-google_admin
```

## Quick Start

```typescript
import { GoogleAdminClient } from '@dotdo/integration-google_admin'

// Initialize client
const client = new GoogleAdminClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogleAdminClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Admin actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogleAdminError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogleAdminError) {
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
