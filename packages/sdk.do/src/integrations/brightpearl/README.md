# Brightpearl Integration

Brightpearl is a retail operations platform offering inventory management, accounting, CRM, and order fulfillment to help merchants handle multichannel sales more efficiently

**Category**: accounting
**Service**: Brightpearl
**Base URL**: https://api.brightpearl.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/brightpearl](https://integrations.do/brightpearl)

## Installation

```bash
npm install @dotdo/integration-brightpearl
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-brightpearl
```

## Quick Start

```typescript
import { BrightpearlClient } from '@dotdo/integration-brightpearl'

// Initialize client
const client = new BrightpearlClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BrightpearlClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Brightpearl actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrightpearlError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrightpearlError) {
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
