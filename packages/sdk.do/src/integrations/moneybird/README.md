# Moneybird Integration

Moneybird is an online invoicing and accounting platform designed for small businesses and freelancers, offering features like invoicing, expense tracking, and financial reporting.

**Category**: productivity
**Service**: Moneybird
**Base URL**: https://api.moneybird.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/moneybird](https://integrations.do/moneybird)

## Installation

```bash
npm install @dotdo/integration-moneybird
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-moneybird
```

## Quick Start

```typescript
import { MoneybirdClient } from '@dotdo/integration-moneybird'

// Initialize client
const client = new MoneybirdClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new MoneybirdClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Moneybird actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MoneybirdError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MoneybirdError) {
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
