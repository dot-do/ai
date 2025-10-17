# Api ninjas Integration

API Ninjas offers over 120 unique APIs across various categories, enabling developers to build real applications with real data.

**Category**: productivity
**Service**: ApiNinjas
**Base URL**: https://api.api_ninjas.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/api_ninjas](https://integrations.do/api_ninjas)

## Installation

```bash
npm install @dotdo/integration-api_ninjas
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-api_ninjas
```

## Quick Start

```typescript
import { ApiNinjasClient } from '@dotdo/integration-api_ninjas'

// Initialize client
const client = new ApiNinjasClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApiNinjasClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Api ninjas actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApiNinjasError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApiNinjasError) {
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
