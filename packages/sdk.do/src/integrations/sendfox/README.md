# Sendfox Integration

Template description for sendfox

**Category**: productivity
**Service**: Sendfox
**Base URL**: https://api.sendfox.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sendfox](https://integrations.do/sendfox)

## Installation

```bash
npm install @dotdo/integration-sendfox
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sendfox
```

## Quick Start

```typescript
import { SendfoxClient } from '@dotdo/integration-sendfox'

// Initialize client
const client = new SendfoxClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SendfoxClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sendfox actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SendfoxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SendfoxError) {
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
