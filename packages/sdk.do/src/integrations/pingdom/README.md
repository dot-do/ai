# Pingdom Integration

Pingdom is a web performance monitoring service that allows users to monitor the uptime and performance of websites, servers, and applications.

**Category**: productivity
**Service**: Pingdom
**Base URL**: https://api.pingdom.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pingdom](https://integrations.do/pingdom)

## Installation

```bash
npm install @dotdo/integration-pingdom
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pingdom
```

## Quick Start

```typescript
import { PingdomClient } from '@dotdo/integration-pingdom'

// Initialize client
const client = new PingdomClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PingdomClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pingdom actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PingdomError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PingdomError) {
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
