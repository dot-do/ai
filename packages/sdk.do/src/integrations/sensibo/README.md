# Sensibo Integration

Sensibo offers smart controllers that connect air conditioners and heat pumps to the internet, enabling remote control and automation.

**Category**: productivity
**Service**: Sensibo
**Base URL**: https://api.sensibo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sensibo](https://integrations.do/sensibo)

## Installation

```bash
npm install @dotdo/integration-sensibo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sensibo
```

## Quick Start

```typescript
import { SensiboClient } from '@dotdo/integration-sensibo'

// Initialize client
const client = new SensiboClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SensiboClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sensibo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SensiboError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SensiboError) {
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
