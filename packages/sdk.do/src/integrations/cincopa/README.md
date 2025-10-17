# Cincopa Integration

Cincopa is a comprehensive media platform offering tools for uploading, managing, and customizing multimedia content, including videos, images, and audio, with robust APIs for seamless integration.

**Category**: productivity
**Service**: Cincopa
**Base URL**: https://api.cincopa.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cincopa](https://integrations.do/cincopa)

## Installation

```bash
npm install @dotdo/integration-cincopa
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cincopa
```

## Quick Start

```typescript
import { CincopaClient } from '@dotdo/integration-cincopa'

// Initialize client
const client = new CincopaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CincopaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cincopa actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CincopaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CincopaError) {
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
