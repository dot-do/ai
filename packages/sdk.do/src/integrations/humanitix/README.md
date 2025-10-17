# Humanitix Integration

Humanitix is a not-for-profit ticketing platform that donates 100% of its profits to charity.

**Category**: productivity
**Service**: Humanitix
**Base URL**: https://api.humanitix.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/humanitix](https://integrations.do/humanitix)

## Installation

```bash
npm install @dotdo/integration-humanitix
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-humanitix
```

## Quick Start

```typescript
import { HumanitixClient } from '@dotdo/integration-humanitix'

// Initialize client
const client = new HumanitixClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HumanitixClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Humanitix actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HumanitixError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HumanitixError) {
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
