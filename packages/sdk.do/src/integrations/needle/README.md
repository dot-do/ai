# Needle Integration

Needle provides retrieval-augmented generation (RAG) tools that enable semantic search across your data, facilitating the development of AI agents and applications.

**Category**: productivity
**Service**: Needle
**Base URL**: https://api.needle.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/needle](https://integrations.do/needle)

## Installation

```bash
npm install @dotdo/integration-needle
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-needle
```

## Quick Start

```typescript
import { NeedleClient } from '@dotdo/integration-needle'

// Initialize client
const client = new NeedleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NeedleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Needle actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NeedleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NeedleError) {
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
