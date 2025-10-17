# Imejis io Integration

Imejis.io is an API-based image generation platform that enables users to create and customize images seamlessly through a user-friendly interface and a rich library of templates.

**Category**: productivity
**Service**: ImejisIo
**Base URL**: https://api.imejis_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/imejis_io](https://integrations.do/imejis_io)

## Installation

```bash
npm install @dotdo/integration-imejis_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-imejis_io
```

## Quick Start

```typescript
import { ImejisIoClient } from '@dotdo/integration-imejis_io'

// Initialize client
const client = new ImejisIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ImejisIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Imejis io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ImejisIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ImejisIoError) {
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
