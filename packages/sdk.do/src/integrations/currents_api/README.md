# Currents api Integration

Currents News API provides access to the latest news articles from various sources worldwide, supporting multiple languages and categories.

**Category**: productivity
**Service**: CurrentsApi
**Base URL**: https://api.currents_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/currents_api](https://integrations.do/currents_api)

## Installation

```bash
npm install @dotdo/integration-currents_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-currents_api
```

## Quick Start

```typescript
import { CurrentsApiClient } from '@dotdo/integration-currents_api'

// Initialize client
const client = new CurrentsApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CurrentsApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Currents api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CurrentsApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CurrentsApiError) {
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
