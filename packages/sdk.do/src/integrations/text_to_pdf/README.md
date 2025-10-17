# Text to pdf Integration

Convert text to PDF

**Category**: developer-tools
**Service**: TextToPdf
**Base URL**: https://api.text_to_pdf.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/text_to_pdf](https://integrations.do/text_to_pdf)

## Installation

```bash
npm install @dotdo/integration-text_to_pdf
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-text_to_pdf
```

## Quick Start

```typescript
import { TextToPdfClient } from '@dotdo/integration-text_to_pdf'

// Initialize client
const client = new TextToPdfClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TextToPdfClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Text to pdf actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TextToPdfError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TextToPdfError) {
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
