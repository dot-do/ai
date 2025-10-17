# Renderform Integration

RenderForm is a user-friendly automation and design tool that enables the creation of templates and images with custom content such as images, texts, and QR codes.

**Category**: productivity
**Service**: Renderform
**Base URL**: https://api.renderform.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/renderform](https://integrations.do/renderform)

## Installation

```bash
npm install @dotdo/integration-renderform
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-renderform
```

## Quick Start

```typescript
import { RenderformClient } from '@dotdo/integration-renderform'

// Initialize client
const client = new RenderformClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RenderformClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Renderform actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RenderformError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RenderformError) {
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
