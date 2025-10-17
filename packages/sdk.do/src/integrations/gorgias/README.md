# Gorgias Integration

Gorgias is a helpdesk and live chat platform specializing in e-commerce, offering automated support, order management, and unified customer communication

**Category**: crm
**Service**: Gorgias
**Base URL**: https://api.gorgias.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gorgias](https://integrations.do/gorgias)

## Installation

```bash
npm install @dotdo/integration-gorgias
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gorgias
```

## Quick Start

```typescript
import { GorgiasClient } from '@dotdo/integration-gorgias'

// Initialize client
const client = new GorgiasClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GorgiasClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Gorgias actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GorgiasError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GorgiasError) {
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
