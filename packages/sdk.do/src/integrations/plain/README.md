# Plain Integration

Plain is a collaborative support platform for B2B support teams, offering a modern, AI-powered interface to consolidate support channels and assist customers efficiently.

**Category**: productivity
**Service**: Plain
**Base URL**: https://api.plain.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/plain](https://integrations.do/plain)

## Installation

```bash
npm install @dotdo/integration-plain
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-plain
```

## Quick Start

```typescript
import { PlainClient } from '@dotdo/integration-plain'

// Initialize client
const client = new PlainClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PlainClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Plain actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PlainError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PlainError) {
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
