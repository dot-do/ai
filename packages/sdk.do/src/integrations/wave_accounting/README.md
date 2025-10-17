# Wave accounting Integration

Wave Accounting is a free accounting solution tailored for small businesses, featuring invoicing, expense tracking, and payroll add-ons

**Category**: accounting
**Service**: WaveAccounting
**Base URL**: https://api.wave_accounting.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/wave_accounting](https://integrations.do/wave_accounting)

## Installation

```bash
npm install @dotdo/integration-wave_accounting
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-wave_accounting
```

## Quick Start

```typescript
import { WaveAccountingClient } from '@dotdo/integration-wave_accounting'

// Initialize client
const client = new WaveAccountingClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new WaveAccountingClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Wave accounting actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WaveAccountingError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WaveAccountingError) {
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
