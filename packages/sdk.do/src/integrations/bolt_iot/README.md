# Bolt iot Integration

Bolt IoT is an integrated platform that enables users to build IoT projects by connecting sensors and actuators to the internet, offering cloud-based control and monitoring capabilities.

**Category**: productivity
**Service**: BoltIot
**Base URL**: https://api.bolt_iot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bolt_iot](https://integrations.do/bolt_iot)

## Installation

```bash
npm install @dotdo/integration-bolt_iot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bolt_iot
```

## Quick Start

```typescript
import { BoltIotClient } from '@dotdo/integration-bolt_iot'

// Initialize client
const client = new BoltIotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BoltIotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bolt iot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BoltIotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BoltIotError) {
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
