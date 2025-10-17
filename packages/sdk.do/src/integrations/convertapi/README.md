# Convertapi Integration

ConvertAPI is a file conversion service that allows developers to convert various file formats, such as documents, images, and spreadsheets, into different formats programmatically.

**Category**: productivity
**Service**: Convertapi
**Base URL**: https://api.convertapi.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/convertapi](https://integrations.do/convertapi)

## Installation

```bash
npm install @dotdo/integration-convertapi
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-convertapi
```

## Quick Start

```typescript
import { ConvertapiClient } from '@dotdo/integration-convertapi'

// Initialize client
const client = new ConvertapiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ConvertapiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Convertapi actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ConvertapiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ConvertapiError) {
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
