# Detrack Integration

Detrack is a delivery management software that offers real-time vehicle tracking, electronic proof of delivery, and automated customer notifications.

**Category**: productivity
**Service**: Detrack
**Base URL**: https://api.detrack.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/detrack](https://integrations.do/detrack)

## Installation

```bash
npm install @dotdo/integration-detrack
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-detrack
```

## Quick Start

```typescript
import { DetrackClient } from '@dotdo/integration-detrack'

// Initialize client
const client = new DetrackClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DetrackClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Detrack actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DetrackError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DetrackError) {
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
