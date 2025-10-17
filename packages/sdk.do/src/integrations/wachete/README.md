# Wachete Integration

Wachete is a web monitoring service that allows users to track changes on web pages and receive notifications based on specified criteria.

**Category**: productivity
**Service**: Wachete
**Base URL**: https://api.wachete.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/wachete](https://integrations.do/wachete)

## Installation

```bash
npm install @dotdo/integration-wachete
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-wachete
```

## Quick Start

```typescript
import { WacheteClient } from '@dotdo/integration-wachete'

// Initialize client
const client = new WacheteClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WacheteClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Wachete actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WacheteError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WacheteError) {
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
