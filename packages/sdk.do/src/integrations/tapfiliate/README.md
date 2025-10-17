# Tapfiliate Integration

Tapfiliate is an affiliate and referral tracking platform that enables businesses to create, track, and scale their affiliate programs efficiently.

**Category**: productivity
**Service**: Tapfiliate
**Base URL**: https://api.tapfiliate.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tapfiliate](https://integrations.do/tapfiliate)

## Installation

```bash
npm install @dotdo/integration-tapfiliate
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tapfiliate
```

## Quick Start

```typescript
import { TapfiliateClient } from '@dotdo/integration-tapfiliate'

// Initialize client
const client = new TapfiliateClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TapfiliateClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Tapfiliate actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TapfiliateError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TapfiliateError) {
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
