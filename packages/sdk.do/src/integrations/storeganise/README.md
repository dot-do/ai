# Storeganise Integration

Storeganise provides modern, cloud-based management software for valet and self-storage businesses, offering features like contactless online bookings, automated billing, and comprehensive APIs for integrations.

**Category**: productivity
**Service**: Storeganise
**Base URL**: https://api.storeganise.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/storeganise](https://integrations.do/storeganise)

## Installation

```bash
npm install @dotdo/integration-storeganise
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-storeganise
```

## Quick Start

```typescript
import { StoreganiseClient } from '@dotdo/integration-storeganise'

// Initialize client
const client = new StoreganiseClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new StoreganiseClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Storeganise actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `StoreganiseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof StoreganiseError) {
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
