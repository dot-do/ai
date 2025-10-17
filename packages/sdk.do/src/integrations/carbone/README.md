# Carbone Integration

Carbone is a fast and simple report generator that converts JSON data into various document formats such as PDF, DOCX, XLSX, ODT, and more, using templates.

**Category**: productivity
**Service**: Carbone
**Base URL**: https://api.carbone.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/carbone](https://integrations.do/carbone)

## Installation

```bash
npm install @dotdo/integration-carbone
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-carbone
```

## Quick Start

```typescript
import { CarboneClient } from '@dotdo/integration-carbone'

// Initialize client
const client = new CarboneClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CarboneClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Carbone actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CarboneError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CarboneError) {
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
