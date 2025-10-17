# Splitwise Integration

Splitwise helps you split bills and expenses with friends and family.

**Category**: productivity
**Service**: Splitwise
**Base URL**: https://api.splitwise.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/splitwise](https://integrations.do/splitwise)

## Installation

```bash
npm install @dotdo/integration-splitwise
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-splitwise
```

## Quick Start

```typescript
import { SplitwiseClient } from '@dotdo/integration-splitwise'

// Initialize client
const client = new SplitwiseClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SplitwiseClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Splitwise actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SplitwiseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SplitwiseError) {
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
