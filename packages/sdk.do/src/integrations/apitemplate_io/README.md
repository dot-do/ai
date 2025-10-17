# Apitemplate io Integration

APITemplate.io provides APIs for generating PDFs and images from reusable templates using JSON data.

**Category**: productivity
**Service**: ApitemplateIo
**Base URL**: https://api.apitemplate_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apitemplate_io](https://integrations.do/apitemplate_io)

## Installation

```bash
npm install @dotdo/integration-apitemplate_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apitemplate_io
```

## Quick Start

```typescript
import { ApitemplateIoClient } from '@dotdo/integration-apitemplate_io'

// Initialize client
const client = new ApitemplateIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApitemplateIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Apitemplate io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApitemplateIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApitemplateIoError) {
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
