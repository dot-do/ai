# Yousearch Integration

YouSearch is a search engine or search tool that enables users to find relevant information, possibly with enhanced filtering or privacy-focused features

**Category**: productivity
**Service**: Yousearch
**Base URL**: https://api.yousearch.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/yousearch](https://integrations.do/yousearch)

## Installation

```bash
npm install @dotdo/integration-yousearch
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-yousearch
```

## Quick Start

```typescript
import { YousearchClient } from '@dotdo/integration-yousearch'

// Initialize client
const client = new YousearchClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new YousearchClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Yousearch actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `YousearchError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof YousearchError) {
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
