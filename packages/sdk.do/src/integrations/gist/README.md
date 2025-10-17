# Gist Integration

GitHub Gist is a service provided by GitHub that allows users to share code snippets, notes, and other text-based content. It supports both public and private gists, enabling easy sharing and collaboration.

**Category**: productivity
**Service**: Gist
**Base URL**: https://api.gist.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gist](https://integrations.do/gist)

## Installation

```bash
npm install @dotdo/integration-gist
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gist
```

## Quick Start

```typescript
import { GistClient } from '@dotdo/integration-gist'

// Initialize client
const client = new GistClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GistClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Gist actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GistError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GistError) {
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
