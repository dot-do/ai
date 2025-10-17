# Canva Integration

Canva offers a drag-and-drop design suite for creating social media graphics, presentations, and marketing materials with prebuilt templates and a vast element library

**Category**: productivity
**Service**: Canva
**Base URL**: https://api.canva.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/canva](https://integrations.do/canva)

## Installation

```bash
npm install @dotdo/integration-canva
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-canva
```

## Quick Start

```typescript
import { CanvaClient } from '@dotdo/integration-canva'

// Initialize client
const client = new CanvaClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new CanvaClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Canva actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CanvaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CanvaError) {
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
