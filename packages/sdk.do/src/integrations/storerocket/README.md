# Storerocket Integration

StoreRocket provides a customizable and easy-to-install store locator solution for websites, enabling businesses to display their physical locations interactively.

**Category**: productivity
**Service**: Storerocket
**Base URL**: https://api.storerocket.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/storerocket](https://integrations.do/storerocket)

## Installation

```bash
npm install @dotdo/integration-storerocket
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-storerocket
```

## Quick Start

```typescript
import { StorerocketClient } from '@dotdo/integration-storerocket'

// Initialize client
const client = new StorerocketClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new StorerocketClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Storerocket actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `StorerocketError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof StorerocketError) {
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
