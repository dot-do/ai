# Ascora Integration

Ascora is a cloud-based field service management software designed to streamline operations for service-based businesses, offering features such as job scheduling, invoicing, customer management, and mobile access.

**Category**: productivity
**Service**: Ascora
**Base URL**: https://api.ascora.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ascora](https://integrations.do/ascora)

## Installation

```bash
npm install @dotdo/integration-ascora
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ascora
```

## Quick Start

```typescript
import { AscoraClient } from '@dotdo/integration-ascora'

// Initialize client
const client = new AscoraClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AscoraClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ascora actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AscoraError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AscoraError) {
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
