# Apaleo Integration

Apaleo is a cloud-based property management platform handling reservations, billing, and daily operations for hospitality businesses

**Category**: productivity
**Service**: Apaleo
**Base URL**: https://api.apaleo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apaleo](https://integrations.do/apaleo)

## Installation

```bash
npm install @dotdo/integration-apaleo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apaleo
```

## Quick Start

```typescript
import { ApaleoClient } from '@dotdo/integration-apaleo'

// Initialize client
const client = new ApaleoClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ApaleoClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Apaleo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApaleoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApaleoError) {
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
