# Instacart Integration

Instacart Developer Platform APIs to create shoppable lists/recipes and discover nearby retailers

**Category**: ecommerce
**Service**: Instacart
**Base URL**: https://api.instacart.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/instacart](https://integrations.do/instacart)

## Installation

```bash
npm install @dotdo/integration-instacart
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-instacart
```

## Quick Start

```typescript
import { InstacartClient } from '@dotdo/integration-instacart'

// Initialize client
const client = new InstacartClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new InstacartClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Instacart actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `InstacartError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof InstacartError) {
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
