# Loomio Integration

Loomio is a collaborative decision-making platform that enables groups to discuss, propose, and make decisions together.

**Category**: productivity
**Service**: Loomio
**Base URL**: https://api.loomio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/loomio](https://integrations.do/loomio)

## Installation

```bash
npm install @dotdo/integration-loomio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-loomio
```

## Quick Start

```typescript
import { LoomioClient } from '@dotdo/integration-loomio'

// Initialize client
const client = new LoomioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LoomioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Loomio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LoomioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LoomioError) {
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
