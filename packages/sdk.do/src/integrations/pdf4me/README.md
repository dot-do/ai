# Pdf4me Integration

PDF4me provides robust, secure, and scalable APIs for document generation, manipulation, and management, enabling easy integration and automation across various applications.

**Category**: productivity
**Service**: Pdf4me
**Base URL**: https://api.pdf4me.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pdf4me](https://integrations.do/pdf4me)

## Installation

```bash
npm install @dotdo/integration-pdf4me
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pdf4me
```

## Quick Start

```typescript
import { Pdf4meClient } from '@dotdo/integration-pdf4me'

// Initialize client
const client = new Pdf4meClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Pdf4meClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pdf4me actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Pdf4meError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Pdf4meError) {
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
