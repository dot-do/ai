# Faceup Integration

FaceUp is an anonymous reporting tool designed for companies and schools, enabling employees and students to safely report issues and misconduct.

**Category**: productivity
**Service**: Faceup
**Base URL**: https://api.faceup.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/faceup](https://integrations.do/faceup)

## Installation

```bash
npm install @dotdo/integration-faceup
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-faceup
```

## Quick Start

```typescript
import { FaceupClient } from '@dotdo/integration-faceup'

// Initialize client
const client = new FaceupClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FaceupClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Faceup actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FaceupError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FaceupError) {
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
