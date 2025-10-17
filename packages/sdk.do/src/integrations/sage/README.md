# Sage Integration

Sage delivers accounting, payroll, and payment software solutions aimed at small to medium enterprises, automating financial tasks and compliance

**Category**: accounting
**Service**: Sage
**Base URL**: https://api.sage.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sage](https://integrations.do/sage)

## Installation

```bash
npm install @dotdo/integration-sage
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sage
```

## Quick Start

```typescript
import { SageClient } from '@dotdo/integration-sage'

// Initialize client
const client = new SageClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SageClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Sage actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SageError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SageError) {
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
