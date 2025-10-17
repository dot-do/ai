# Sourcegraph Integration

Sourcegraph is a code intelligence platform that enables developers to search, understand, and manage code across large codebases.

**Category**: productivity
**Service**: Sourcegraph
**Base URL**: https://api.sourcegraph.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sourcegraph](https://integrations.do/sourcegraph)

## Installation

```bash
npm install @dotdo/integration-sourcegraph
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sourcegraph
```

## Quick Start

```typescript
import { SourcegraphClient } from '@dotdo/integration-sourcegraph'

// Initialize client
const client = new SourcegraphClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SourcegraphClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sourcegraph actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SourcegraphError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SourcegraphError) {
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
