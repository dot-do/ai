# Ramp Integration

Ramp is a platform that helps you manage your finances, track your income and expenses, and get insights into your business

**Category**: accounting
**Service**: Ramp
**Base URL**: https://api.ramp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ramp](https://integrations.do/ramp)

## Installation

```bash
npm install @dotdo/integration-ramp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ramp
```

## Quick Start

```typescript
import { RampClient } from '@dotdo/integration-ramp'

// Initialize client
const client = new RampClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new RampClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Ramp actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RampError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RampError) {
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
