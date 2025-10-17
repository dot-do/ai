# Stannp Integration

Stannp provides a direct mail API enabling users to send postcards and letters programmatically.

**Category**: productivity
**Service**: Stannp
**Base URL**: https://api.stannp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/stannp](https://integrations.do/stannp)

## Installation

```bash
npm install @dotdo/integration-stannp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-stannp
```

## Quick Start

```typescript
import { StannpClient } from '@dotdo/integration-stannp'

// Initialize client
const client = new StannpClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new StannpClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Stannp actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `StannpError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof StannpError) {
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
