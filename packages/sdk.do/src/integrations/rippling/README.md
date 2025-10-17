# Rippling Integration

Rippling unifies HR, IT, and finance tasks, handling payroll, benefits, device management, and app provisioning under a single platform

**Category**: hr
**Service**: Rippling
**Base URL**: https://api.rippling.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/rippling](https://integrations.do/rippling)

## Installation

```bash
npm install @dotdo/integration-rippling
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-rippling
```

## Quick Start

```typescript
import { RipplingClient } from '@dotdo/integration-rippling'

// Initialize client
const client = new RipplingClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new RipplingClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Rippling actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RipplingError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RipplingError) {
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
