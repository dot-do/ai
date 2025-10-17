# Ocrspace Integration

OCR.space provides a free and paid OCR API for extracting text from images and PDFs, returning results in JSON format.

**Category**: productivity
**Service**: Ocrspace
**Base URL**: https://api.ocrspace.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ocrspace](https://integrations.do/ocrspace)

## Installation

```bash
npm install @dotdo/integration-ocrspace
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ocrspace
```

## Quick Start

```typescript
import { OcrspaceClient } from '@dotdo/integration-ocrspace'

// Initialize client
const client = new OcrspaceClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OcrspaceClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ocrspace actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OcrspaceError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OcrspaceError) {
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
