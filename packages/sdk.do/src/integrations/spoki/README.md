# Spoki Integration

Spoki is an Italian platform that integrates WhatsApp's official APIs to automate communication for marketing, sales, customer support, and payments.

**Category**: productivity
**Service**: Spoki
**Base URL**: https://api.spoki.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/spoki](https://integrations.do/spoki)

## Installation

```bash
npm install @dotdo/integration-spoki
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-spoki
```

## Quick Start

```typescript
import { SpokiClient } from '@dotdo/integration-spoki'

// Initialize client
const client = new SpokiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SpokiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Spoki actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SpokiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SpokiError) {
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
