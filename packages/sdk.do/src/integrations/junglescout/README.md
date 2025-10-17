# Junglescout Integration

Jungle Scout assists Amazon sellers with product research, sales estimates, and competitive insights to optimize inventory, pricing, and listing strategies

**Category**: ecommerce
**Service**: Junglescout
**Base URL**: https://api.junglescout.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/junglescout](https://integrations.do/junglescout)

## Installation

```bash
npm install @dotdo/integration-junglescout
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-junglescout
```

## Quick Start

```typescript
import { JunglescoutClient } from '@dotdo/integration-junglescout'

// Initialize client
const client = new JunglescoutClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new JunglescoutClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Junglescout actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `JunglescoutError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof JunglescoutError) {
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
