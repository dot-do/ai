# Pdf co Integration

PDF.co is a secure, cost-effective, and scalable API platform offering a suite of web APIs for tasks such as PDF extraction, generation, editing, splitting, merging, form filling, and barcode processing.

**Category**: productivity
**Service**: PdfCo
**Base URL**: https://api.pdf_co.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pdf_co](https://integrations.do/pdf_co)

## Installation

```bash
npm install @dotdo/integration-pdf_co
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pdf_co
```

## Quick Start

```typescript
import { PdfCoClient } from '@dotdo/integration-pdf_co'

// Initialize client
const client = new PdfCoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PdfCoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pdf co actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PdfCoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PdfCoError) {
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
