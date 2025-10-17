# Grafbase Integration

Grafbase is a platform that accelerates the development of GraphQL APIs, offering features like edge caching, unified data access, and seamless integration with popular authentication strategies.

**Category**: productivity
**Service**: Grafbase
**Base URL**: https://api.grafbase.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/grafbase](https://integrations.do/grafbase)

## Installation

```bash
npm install @dotdo/integration-grafbase
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-grafbase
```

## Quick Start

```typescript
import { GrafbaseClient } from '@dotdo/integration-grafbase'

// Initialize client
const client = new GrafbaseClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GrafbaseClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Grafbase actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GrafbaseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GrafbaseError) {
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
