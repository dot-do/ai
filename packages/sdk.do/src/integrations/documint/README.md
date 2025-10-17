# Documint Integration

Template description for documint

**Category**: productivity
**Service**: Documint
**Base URL**: https://api.documint.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/documint](https://integrations.do/documint)

## Installation

```bash
npm install @dotdo/integration-documint
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-documint
```

## Quick Start

```typescript
import { DocumintClient } from '@dotdo/integration-documint'

// Initialize client
const client = new DocumintClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DocumintClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Documint actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DocumintError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DocumintError) {
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
