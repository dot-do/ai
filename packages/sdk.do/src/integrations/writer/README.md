# Writer Integration

Writer is a full-stack generative AI platform for enterprises, offering tools to build and deploy AI applications integrated with their suite of LLMs, graph-based RAG tools, and AI guardrails.

**Category**: productivity
**Service**: Writer
**Base URL**: https://api.writer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/writer](https://integrations.do/writer)

## Installation

```bash
npm install @dotdo/integration-writer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-writer
```

## Quick Start

```typescript
import { WriterClient } from '@dotdo/integration-writer'

// Initialize client
const client = new WriterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WriterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Writer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WriterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WriterError) {
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
