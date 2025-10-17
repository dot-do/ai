# Telnyx Integration

Telnyx is a communications platform offering voice, messaging, and data services through a global private network.

**Category**: productivity
**Service**: Telnyx
**Base URL**: https://api.telnyx.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/telnyx](https://integrations.do/telnyx)

## Installation

```bash
npm install @dotdo/integration-telnyx
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-telnyx
```

## Quick Start

```typescript
import { TelnyxClient } from '@dotdo/integration-telnyx'

// Initialize client
const client = new TelnyxClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TelnyxClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Telnyx actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TelnyxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TelnyxError) {
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
