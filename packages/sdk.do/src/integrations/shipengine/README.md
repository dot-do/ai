# Shipengine Integration

ShipEngine is a REST API that simplifies shipping processes by integrating with multiple carriers, allowing users to manage shipping labels, track packages, and validate addresses efficiently.

**Category**: productivity
**Service**: Shipengine
**Base URL**: https://api.shipengine.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/shipengine](https://integrations.do/shipengine)

## Installation

```bash
npm install @dotdo/integration-shipengine
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-shipengine
```

## Quick Start

```typescript
import { ShipengineClient } from '@dotdo/integration-shipengine'

// Initialize client
const client = new ShipengineClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ShipengineClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Shipengine actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ShipengineError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ShipengineError) {
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
