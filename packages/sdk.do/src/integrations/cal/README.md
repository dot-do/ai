# Cal Integration

Cal simplifies meeting coordination by providing shareable booking pages, calendar syncing, and availability management to streamline the scheduling process

**Category**: productivity
**Service**: Cal
**Base URL**: https://api.cal.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cal](https://integrations.do/cal)

## Installation

```bash
npm install @dotdo/integration-cal
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cal
```

## Quick Start

```typescript
import { CalClient } from '@dotdo/integration-cal'

// Initialize client
const client = new CalClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CalClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cal actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CalError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CalError) {
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
