# Mem0 Integration

Mem0 assists with AI-driven note-taking, knowledge recall, and productivity tools, allowing users to organize, search, and generate content from stored information

**Category**: developer-tools
**Service**: Mem0
**Base URL**: https://api.mem0.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mem0](https://integrations.do/mem0)

## Installation

```bash
npm install @dotdo/integration-mem0
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mem0
```

## Quick Start

```typescript
import { Mem0Client } from '@dotdo/integration-mem0'

// Initialize client
const client = new Mem0Client({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Mem0Client({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mem0 actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Mem0Error` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Mem0Error) {
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
