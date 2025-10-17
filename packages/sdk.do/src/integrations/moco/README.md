# Moco Integration

MOCO is a business management software offering project management, time tracking, and invoicing solutions.

**Category**: productivity
**Service**: Moco
**Base URL**: https://api.moco.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/moco](https://integrations.do/moco)

## Installation

```bash
npm install @dotdo/integration-moco
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-moco
```

## Quick Start

```typescript
import { MocoClient } from '@dotdo/integration-moco'

// Initialize client
const client = new MocoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MocoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Moco actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MocoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MocoError) {
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
