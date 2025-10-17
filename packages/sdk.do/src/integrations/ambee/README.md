# Ambee Integration

Ambee provides real-time, hyperlocal environmental data through APIs, offering insights into air quality, weather, pollen, and more.

**Category**: productivity
**Service**: Ambee
**Base URL**: https://api.ambee.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ambee](https://integrations.do/ambee)

## Installation

```bash
npm install @dotdo/integration-ambee
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ambee
```

## Quick Start

```typescript
import { AmbeeClient } from '@dotdo/integration-ambee'

// Initialize client
const client = new AmbeeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AmbeeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ambee actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AmbeeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AmbeeError) {
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
