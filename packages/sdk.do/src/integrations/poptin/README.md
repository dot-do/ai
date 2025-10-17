# Poptin Integration

Poptin is a conversion optimization toolkit that enables users to create engaging pop-ups and forms to convert website visitors into subscribers, leads, and customers.

**Category**: productivity
**Service**: Poptin
**Base URL**: https://api.poptin.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/poptin](https://integrations.do/poptin)

## Installation

```bash
npm install @dotdo/integration-poptin
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-poptin
```

## Quick Start

```typescript
import { PoptinClient } from '@dotdo/integration-poptin'

// Initialize client
const client = new PoptinClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PoptinClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Poptin actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PoptinError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PoptinError) {
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
