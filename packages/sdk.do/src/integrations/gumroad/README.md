# Gumroad Integration

Gumroad simplifies selling digital goods, physical products, and memberships by offering a streamlined checkout, marketing tools, and direct payout options

**Category**: ecommerce
**Service**: Gumroad
**Base URL**: https://api.gumroad.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gumroad](https://integrations.do/gumroad)

## Installation

```bash
npm install @dotdo/integration-gumroad
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gumroad
```

## Quick Start

```typescript
import { GumroadClient } from '@dotdo/integration-gumroad'

// Initialize client
const client = new GumroadClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GumroadClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Gumroad actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GumroadError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GumroadError) {
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
