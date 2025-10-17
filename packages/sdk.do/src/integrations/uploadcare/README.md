# Uploadcare Integration

Uploadcare is a comprehensive file handling service that offers uploading, storage, processing, and delivery solutions for web and mobile applications.

**Category**: productivity
**Service**: Uploadcare
**Base URL**: https://api.uploadcare.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/uploadcare](https://integrations.do/uploadcare)

## Installation

```bash
npm install @dotdo/integration-uploadcare
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-uploadcare
```

## Quick Start

```typescript
import { UploadcareClient } from '@dotdo/integration-uploadcare'

// Initialize client
const client = new UploadcareClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new UploadcareClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Uploadcare actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `UploadcareError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof UploadcareError) {
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
