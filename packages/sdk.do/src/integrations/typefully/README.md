# Typefully Integration

Typefully is a platform for creating and managing AI-powered content

**Category**: developer-tools
**Service**: Typefully
**Base URL**: https://api.typefully.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/typefully](https://integrations.do/typefully)

## Installation

```bash
npm install @dotdo/integration-typefully
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-typefully
```

## Quick Start

```typescript
import { TypefullyClient } from '@dotdo/integration-typefully'

// Initialize client
const client = new TypefullyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TypefullyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Typefully actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TypefullyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TypefullyError) {
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
