# Elorus Integration

Elorus is an online invoicing and time-tracking software designed for freelancers and small businesses to manage their finances and projects efficiently.

**Category**: productivity
**Service**: Elorus
**Base URL**: https://api.elorus.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/elorus](https://integrations.do/elorus)

## Installation

```bash
npm install @dotdo/integration-elorus
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-elorus
```

## Quick Start

```typescript
import { ElorusClient } from '@dotdo/integration-elorus'

// Initialize client
const client = new ElorusClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ElorusClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Elorus actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ElorusError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ElorusError) {
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
