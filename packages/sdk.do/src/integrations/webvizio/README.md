# Webvizio Integration

Webvizio is a visual feedback and collaboration tool for web professionals, enabling users to annotate web pages, share feedback, track bugs, and manage tasks efficiently.

**Category**: productivity
**Service**: Webvizio
**Base URL**: https://api.webvizio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/webvizio](https://integrations.do/webvizio)

## Installation

```bash
npm install @dotdo/integration-webvizio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-webvizio
```

## Quick Start

```typescript
import { WebvizioClient } from '@dotdo/integration-webvizio'

// Initialize client
const client = new WebvizioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WebvizioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Webvizio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WebvizioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WebvizioError) {
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
