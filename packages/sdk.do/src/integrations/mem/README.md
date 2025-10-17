# Mem Integration

Mem is a note-taking and knowledge management application that helps users capture, organize, and retrieve information efficiently.

**Category**: productivity
**Service**: Mem
**Base URL**: https://api.mem.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mem](https://integrations.do/mem)

## Installation

```bash
npm install @dotdo/integration-mem
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mem
```

## Quick Start

```typescript
import { MemClient } from '@dotdo/integration-mem'

// Initialize client
const client = new MemClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MemClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mem actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MemError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MemError) {
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
