# Retailed Integration

Retailed is a developer-first platform offering retail APIs for dynamic pricing, inventory management, and data integration across various e-commerce platforms.

**Category**: productivity
**Service**: Retailed
**Base URL**: https://api.retailed.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/retailed](https://integrations.do/retailed)

## Installation

```bash
npm install @dotdo/integration-retailed
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-retailed
```

## Quick Start

```typescript
import { RetailedClient } from '@dotdo/integration-retailed'

// Initialize client
const client = new RetailedClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RetailedClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Retailed actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RetailedError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RetailedError) {
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
