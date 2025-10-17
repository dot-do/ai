# Bigpicture io Integration

BigPicture.io provides APIs and datasets for accessing comprehensive company data, including information on over 20 million profiles, used in applications like fintech products, cybersecurity, market research, and sales & marketing tools.

**Category**: productivity
**Service**: BigpictureIo
**Base URL**: https://api.bigpicture_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bigpicture_io](https://integrations.do/bigpicture_io)

## Installation

```bash
npm install @dotdo/integration-bigpicture_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bigpicture_io
```

## Quick Start

```typescript
import { BigpictureIoClient } from '@dotdo/integration-bigpicture_io'

// Initialize client
const client = new BigpictureIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BigpictureIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bigpicture io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BigpictureIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BigpictureIoError) {
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
