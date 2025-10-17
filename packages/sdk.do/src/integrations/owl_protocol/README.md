# Owl protocol Integration

Owl Protocol empowers developers to build feature-rich, user-friendly Web3 applications for mainstream adoption through modular infrastructure that simplifies blockchain development.

**Category**: productivity
**Service**: OwlProtocol
**Base URL**: https://api.owl_protocol.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/owl_protocol](https://integrations.do/owl_protocol)

## Installation

```bash
npm install @dotdo/integration-owl_protocol
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-owl_protocol
```

## Quick Start

```typescript
import { OwlProtocolClient } from '@dotdo/integration-owl_protocol'

// Initialize client
const client = new OwlProtocolClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OwlProtocolClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Owl protocol actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OwlProtocolError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OwlProtocolError) {
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
