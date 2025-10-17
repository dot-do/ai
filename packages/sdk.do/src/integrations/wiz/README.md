# Wiz Integration

Wiz is a cloud security platform automating risk detection, compliance checks, and infrastructure scanning across cloud environments

**Category**: productivity
**Service**: Wiz
**Base URL**: https://api.wiz.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/wiz](https://integrations.do/wiz)

## Installation

```bash
npm install @dotdo/integration-wiz
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-wiz
```

## Quick Start

```typescript
import { WizClient } from '@dotdo/integration-wiz'

// Initialize client
const client = new WizClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new WizClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Wiz actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WizError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WizError) {
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
