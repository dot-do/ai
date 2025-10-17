# Vestaboard Integration

Vestaboard is a smart messaging display that allows users to send and receive messages through a mechanical split-flap display.

**Category**: productivity
**Service**: Vestaboard
**Base URL**: https://api.vestaboard.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/vestaboard](https://integrations.do/vestaboard)

## Installation

```bash
npm install @dotdo/integration-vestaboard
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-vestaboard
```

## Quick Start

```typescript
import { VestaboardClient } from '@dotdo/integration-vestaboard'

// Initialize client
const client = new VestaboardClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new VestaboardClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Vestaboard actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `VestaboardError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof VestaboardError) {
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
