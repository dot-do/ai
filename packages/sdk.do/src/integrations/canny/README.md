# Canny Integration

Canny is a customer feedback management platform that helps teams collect, analyze, and prioritize user feedback to build better products.

**Category**: productivity
**Service**: Canny
**Base URL**: https://api.canny.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/canny](https://integrations.do/canny)

## Installation

```bash
npm install @dotdo/integration-canny
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-canny
```

## Quick Start

```typescript
import { CannyClient } from '@dotdo/integration-canny'

// Initialize client
const client = new CannyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CannyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Canny actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CannyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CannyError) {
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
