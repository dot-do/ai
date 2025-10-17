# Microsoft tenant Integration

Microsoft Tenant commonly refers to an instance of Microsoft 365 or Azure used by enterprises for cloud-based services, billing, and account management

**Category**: accounting
**Service**: MicrosoftTenant
**Base URL**: https://api.microsoft_tenant.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/microsoft_tenant](https://integrations.do/microsoft_tenant)

## Installation

```bash
npm install @dotdo/integration-microsoft_tenant
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-microsoft_tenant
```

## Quick Start

```typescript
import { MicrosoftTenantClient } from '@dotdo/integration-microsoft_tenant'

// Initialize client
const client = new MicrosoftTenantClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new MicrosoftTenantClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Microsoft tenant actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MicrosoftTenantError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MicrosoftTenantError) {
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
