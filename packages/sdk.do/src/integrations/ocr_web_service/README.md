# Ocr web service Integration

OCR Web Service provides SOAP and REST APIs for integrating Optical Character Recognition (OCR) technology into software products, mobile devices, or other web services.

**Category**: productivity
**Service**: OcrWebService
**Base URL**: https://api.ocr_web_service.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ocr_web_service](https://integrations.do/ocr_web_service)

## Installation

```bash
npm install @dotdo/integration-ocr_web_service
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ocr_web_service
```

## Quick Start

```typescript
import { OcrWebServiceClient } from '@dotdo/integration-ocr_web_service'

// Initialize client
const client = new OcrWebServiceClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OcrWebServiceClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ocr web service actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OcrWebServiceError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OcrWebServiceError) {
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
