# Dreamstudio Integration

DreamStudio is Stability AI's user interface for generative AI, allowing users to create and edit generated images.

**Category**: productivity
**Service**: Dreamstudio
**Base URL**: https://api.dreamstudio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dreamstudio](https://integrations.do/dreamstudio)

## Installation

```bash
npm install @dotdo/integration-dreamstudio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dreamstudio
```

## Quick Start

```typescript
import { DreamstudioClient } from '@dotdo/integration-dreamstudio'

// Initialize client
const client = new DreamstudioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DreamstudioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dreamstudio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DreamstudioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DreamstudioError) {
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
