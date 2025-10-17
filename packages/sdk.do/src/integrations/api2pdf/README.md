# Api2pdf Integration

Api2Pdf is a REST API that enables developers to generate PDFs from HTML, URLs, and various document formats using engines like wkhtmltopdf, Headless Chrome, and LibreOffice.

**Category**: productivity
**Service**: Api2pdf
**Base URL**: https://api.api2pdf.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/api2pdf](https://integrations.do/api2pdf)

## Installation

```bash
npm install @dotdo/integration-api2pdf
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-api2pdf
```

## Quick Start

```typescript
import { Api2pdfClient } from '@dotdo/integration-api2pdf'

// Initialize client
const client = new Api2pdfClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Api2pdfClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Api2pdf actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Api2pdfError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Api2pdfError) {
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
