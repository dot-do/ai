# Imagior Integration

Imagior is an AI-powered automated image generation software that enables businesses and creators to create and customize images using templates via no-code or API solutions.

**Category**: productivity
**Service**: Imagior
**Base URL**: https://api.imagior.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/imagior](https://integrations.do/imagior)

## Installation

```bash
npm install @dotdo/integration-imagior
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-imagior
```

## Quick Start

```typescript
import { ImagiorClient } from '@dotdo/integration-imagior'

// Initialize client
const client = new ImagiorClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ImagiorClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Imagior actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ImagiorError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ImagiorError) {
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
