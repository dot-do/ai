# Smugmug Integration

SmugMug is a platform for photographers to showcase, share, and sell their photos and videos.

**Category**: productivity
**Service**: Smugmug
**Base URL**: https://api.smugmug.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/smugmug](https://integrations.do/smugmug)

## Installation

```bash
npm install @dotdo/integration-smugmug
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-smugmug
```

## Quick Start

```typescript
import { SmugmugClient } from '@dotdo/integration-smugmug'

// Initialize client
const client = new SmugmugClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SmugmugClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Smugmug actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SmugmugError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SmugmugError) {
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
