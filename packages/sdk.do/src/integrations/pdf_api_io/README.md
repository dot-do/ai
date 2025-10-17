# Pdf api io Integration

PDF-API.io offers a dynamic PDF generation API with a drag-and-drop template designer, allowing developers to create customizable PDFs using HTML and CSS.

**Category**: productivity
**Service**: PdfApiIo
**Base URL**: https://api.pdf_api_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pdf_api_io](https://integrations.do/pdf_api_io)

## Installation

```bash
npm install @dotdo/integration-pdf_api_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pdf_api_io
```

## Quick Start

```typescript
import { PdfApiIoClient } from '@dotdo/integration-pdf_api_io'

// Initialize client
const client = new PdfApiIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PdfApiIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pdf api io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PdfApiIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PdfApiIoError) {
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
