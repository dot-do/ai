# Opengraph io Integration

OpenGraph.io provides a simple API to retrieve Open Graph data from websites, even those without properly defined Open Graph tags.

**Category**: productivity
**Service**: OpengraphIo
**Base URL**: https://api.opengraph_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/opengraph_io](https://integrations.do/opengraph_io)

## Installation

```bash
npm install @dotdo/integration-opengraph_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-opengraph_io
```

## Quick Start

```typescript
import { OpengraphIoClient } from '@dotdo/integration-opengraph_io'

// Initialize client
const client = new OpengraphIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OpengraphIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Opengraph io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OpengraphIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OpengraphIoError) {
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
