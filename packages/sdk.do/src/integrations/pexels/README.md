# Pexels Integration

Pexels offers a free API that provides access to a vast library of high-quality photos and videos, enabling seamless integration into applications and websites.

**Category**: productivity
**Service**: Pexels
**Base URL**: https://api.pexels.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pexels](https://integrations.do/pexels)

## Installation

```bash
npm install @dotdo/integration-pexels
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pexels
```

## Quick Start

```typescript
import { PexelsClient } from '@dotdo/integration-pexels'

// Initialize client
const client = new PexelsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PexelsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pexels actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PexelsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PexelsError) {
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
