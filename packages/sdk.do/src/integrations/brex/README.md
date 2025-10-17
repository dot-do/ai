# Brex Integration

Brex provides corporate credit cards, spend management, and financial tools tailored for startups and tech businesses to optimize cash flow, accounting, and growth

**Category**: accounting
**Service**: Brex
**Base URL**: https://api.brex.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/brex](https://integrations.do/brex)

## Installation

```bash
npm install @dotdo/integration-brex
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-brex
```

## Quick Start

```typescript
import { BrexClient } from '@dotdo/integration-brex'

// Initialize client
const client = new BrexClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BrexClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Brex actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrexError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrexError) {
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
