# Pdfless Integration

Pdfless is a document factory that enables developers to create high-quality PDF documents using HTML/CSS templates and data integration.

**Category**: productivity
**Service**: Pdfless
**Base URL**: https://api.pdfless.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pdfless](https://integrations.do/pdfless)

## Installation

```bash
npm install @dotdo/integration-pdfless
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pdfless
```

## Quick Start

```typescript
import { PdflessClient } from '@dotdo/integration-pdfless'

// Initialize client
const client = new PdflessClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PdflessClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pdfless actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PdflessError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PdflessError) {
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
