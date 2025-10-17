# Shotstack Integration

Shotstack is a cloud-based platform that enables developers, marketers, and designers to automate the generation of videos, images, and audio at scale using a RESTful API.

**Category**: productivity
**Service**: Shotstack
**Base URL**: https://api.shotstack.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/shotstack](https://integrations.do/shotstack)

## Installation

```bash
npm install @dotdo/integration-shotstack
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-shotstack
```

## Quick Start

```typescript
import { ShotstackClient } from '@dotdo/integration-shotstack'

// Initialize client
const client = new ShotstackClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ShotstackClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Shotstack actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ShotstackError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ShotstackError) {
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
