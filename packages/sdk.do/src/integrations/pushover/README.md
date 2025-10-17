# Pushover Integration

Pushover is a service that enables real-time notifications to your devices through simple API integration.

**Category**: productivity
**Service**: Pushover
**Base URL**: https://api.pushover.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pushover](https://integrations.do/pushover)

## Installation

```bash
npm install @dotdo/integration-pushover
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pushover
```

## Quick Start

```typescript
import { PushoverClient } from '@dotdo/integration-pushover'

// Initialize client
const client = new PushoverClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PushoverClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pushover actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PushoverError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PushoverError) {
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
