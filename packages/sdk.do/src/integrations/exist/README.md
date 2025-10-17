# Exist Integration

Exist is a personal analytics app that combines data from various services to help users understand and improve their lives.

**Category**: productivity
**Service**: Exist
**Base URL**: https://api.exist.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/exist](https://integrations.do/exist)

## Installation

```bash
npm install @dotdo/integration-exist
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-exist
```

## Quick Start

```typescript
import { ExistClient } from '@dotdo/integration-exist'

// Initialize client
const client = new ExistClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ExistClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Exist actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ExistError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ExistError) {
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
