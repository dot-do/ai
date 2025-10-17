# Metaphor Integration

Metaphor is a neural search engine that enables developers to perform contextually relevant searches by understanding how people describe and share content online.

**Category**: productivity
**Service**: Metaphor
**Base URL**: https://api.metaphor.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/metaphor](https://integrations.do/metaphor)

## Installation

```bash
npm install @dotdo/integration-metaphor
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-metaphor
```

## Quick Start

```typescript
import { MetaphorClient } from '@dotdo/integration-metaphor'

// Initialize client
const client = new MetaphorClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MetaphorClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Metaphor actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MetaphorError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MetaphorError) {
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
