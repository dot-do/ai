# Render Integration

Render is a unified cloud platform that enables developers to build and run applications and websites with ease.

**Category**: productivity
**Service**: Render
**Base URL**: https://api.render.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/render](https://integrations.do/render)

## Installation

```bash
npm install @dotdo/integration-render
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-render
```

## Quick Start

```typescript
import { RenderClient } from '@dotdo/integration-render'

// Initialize client
const client = new RenderClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RenderClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Render actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RenderError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RenderError) {
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
