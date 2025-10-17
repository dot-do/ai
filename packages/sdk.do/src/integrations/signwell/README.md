# Signwell Integration

SignWell is an electronic signature tool for legally binding e-signatures and faster document signing.

**Category**: productivity
**Service**: Signwell
**Base URL**: https://api.signwell.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/signwell](https://integrations.do/signwell)

## Installation

```bash
npm install @dotdo/integration-signwell
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-signwell
```

## Quick Start

```typescript
import { SignwellClient } from '@dotdo/integration-signwell'

// Initialize client
const client = new SignwellClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SignwellClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Signwell actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SignwellError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SignwellError) {
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
