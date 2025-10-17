# Onepage Integration

API for enriching user and company data, providing endpoints for token validation and generic search.

**Category**: productivity
**Service**: Onepage
**Base URL**: https://api.onepage.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/onepage](https://integrations.do/onepage)

## Installation

```bash
npm install @dotdo/integration-onepage
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-onepage
```

## Quick Start

```typescript
import { OnepageClient } from '@dotdo/integration-onepage'

// Initialize client
const client = new OnepageClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OnepageClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Onepage actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OnepageError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OnepageError) {
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
