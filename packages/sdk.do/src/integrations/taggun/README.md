# Taggun Integration

Taggun provides a real-time, high-accuracy receipt OCR API for extracting structured data from receipt images.

**Category**: productivity
**Service**: Taggun
**Base URL**: https://api.taggun.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/taggun](https://integrations.do/taggun)

## Installation

```bash
npm install @dotdo/integration-taggun
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-taggun
```

## Quick Start

```typescript
import { TaggunClient } from '@dotdo/integration-taggun'

// Initialize client
const client = new TaggunClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TaggunClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Taggun actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TaggunError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TaggunError) {
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
