# Remove bg Integration

remove_bg is an API that allows developers to automatically remove backgrounds from images using AI technology.

**Category**: productivity
**Service**: RemoveBg
**Base URL**: https://api.remove_bg.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/remove_bg](https://integrations.do/remove_bg)

## Installation

```bash
npm install @dotdo/integration-remove_bg
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-remove_bg
```

## Quick Start

```typescript
import { RemoveBgClient } from '@dotdo/integration-remove_bg'

// Initialize client
const client = new RemoveBgClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RemoveBgClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Remove bg actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RemoveBgError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RemoveBgError) {
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
