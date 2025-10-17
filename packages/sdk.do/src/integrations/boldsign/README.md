# Boldsign Integration

BoldSign delivers eSignature solutions, letting organizations create, send, and manage legally binding documents through streamlined digital signing workflows

**Category**: storage
**Service**: Boldsign
**Base URL**: https://api.boldsign.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/boldsign](https://integrations.do/boldsign)

## Installation

```bash
npm install @dotdo/integration-boldsign
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-boldsign
```

## Quick Start

```typescript
import { BoldsignClient } from '@dotdo/integration-boldsign'

// Initialize client
const client = new BoldsignClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BoldsignClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Boldsign actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BoldsignError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BoldsignError) {
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
