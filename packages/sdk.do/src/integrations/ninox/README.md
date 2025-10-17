# Ninox Integration

Ninox is a low-code platform that enables users to create custom database applications tailored to their specific needs.

**Category**: productivity
**Service**: Ninox
**Base URL**: https://api.ninox.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ninox](https://integrations.do/ninox)

## Installation

```bash
npm install @dotdo/integration-ninox
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ninox
```

## Quick Start

```typescript
import { NinoxClient } from '@dotdo/integration-ninox'

// Initialize client
const client = new NinoxClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NinoxClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ninox actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NinoxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NinoxError) {
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
