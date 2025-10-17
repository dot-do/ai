# Extracta ai Integration

Extracta.ai is an AI-powered platform that automates data extraction from various document types, including PDFs, images, and text files, without requiring prior training.

**Category**: productivity
**Service**: ExtractaAi
**Base URL**: https://api.extracta_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/extracta_ai](https://integrations.do/extracta_ai)

## Installation

```bash
npm install @dotdo/integration-extracta_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-extracta_ai
```

## Quick Start

```typescript
import { ExtractaAiClient } from '@dotdo/integration-extracta_ai'

// Initialize client
const client = new ExtractaAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ExtractaAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Extracta ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ExtractaAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ExtractaAiError) {
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
