# Vercel Integration

Vercel is a platform for frontend frameworks and static sites, enabling developers to host websites and web services that deploy instantly, scale automatically, and require minimal configuration.

**Category**: productivity
**Service**: Vercel
**Base URL**: https://api.vercel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/vercel](https://integrations.do/vercel)

## Installation

```bash
npm install @dotdo/integration-vercel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-vercel
```

## Quick Start

```typescript
import { VercelClient } from '@dotdo/integration-vercel'

// Initialize client
const client = new VercelClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new VercelClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Vercel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `VercelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof VercelError) {
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
