# Svix Integration

Svix is an enterprise-ready webhooks service that enables developers to send webhooks reliably and securely.

**Category**: productivity
**Service**: Svix
**Base URL**: https://api.svix.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/svix](https://integrations.do/svix)

## Installation

```bash
npm install @dotdo/integration-svix
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-svix
```

## Quick Start

```typescript
import { SvixClient } from '@dotdo/integration-svix'

// Initialize client
const client = new SvixClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SvixClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Svix actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SvixError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SvixError) {
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
