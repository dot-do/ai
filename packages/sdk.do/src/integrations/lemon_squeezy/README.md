# Lemon squeezy Integration

Lemon Squeezy is a platform designed to simplify payments, taxes, and subscriptions for software companies, offering a powerful API and webhooks for seamless integration.

**Category**: ecommerce
**Service**: LemonSqueezy
**Base URL**: https://api.lemon_squeezy.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/lemon_squeezy](https://integrations.do/lemon_squeezy)

## Installation

```bash
npm install @dotdo/integration-lemon_squeezy
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-lemon_squeezy
```

## Quick Start

```typescript
import { LemonSqueezyClient } from '@dotdo/integration-lemon_squeezy'

// Initialize client
const client = new LemonSqueezyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LemonSqueezyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Lemon squeezy actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LemonSqueezyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LemonSqueezyError) {
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
