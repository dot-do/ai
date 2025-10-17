# Api labz Integration

API Labz offers a comprehensive suite of AI-driven APIs and tools designed to streamline workflows, automate tasks, and build innovative applications.

**Category**: productivity
**Service**: ApiLabz
**Base URL**: https://api.api_labz.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/api_labz](https://integrations.do/api_labz)

## Installation

```bash
npm install @dotdo/integration-api_labz
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-api_labz
```

## Quick Start

```typescript
import { ApiLabzClient } from '@dotdo/integration-api_labz'

// Initialize client
const client = new ApiLabzClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApiLabzClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Api labz actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApiLabzError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApiLabzError) {
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
