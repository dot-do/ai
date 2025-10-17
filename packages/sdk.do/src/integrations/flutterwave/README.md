# Flutterwave Integration

Flutterwave is a payments technology company that provides payment infrastructure and APIs enabling businesses to accept and send payments in Africa and globally.

**Category**: productivity
**Service**: Flutterwave
**Base URL**: https://api.flutterwave.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/flutterwave](https://integrations.do/flutterwave)

## Installation

```bash
npm install @dotdo/integration-flutterwave
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-flutterwave
```

## Quick Start

```typescript
import { FlutterwaveClient } from '@dotdo/integration-flutterwave'

// Initialize client
const client = new FlutterwaveClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FlutterwaveClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Flutterwave actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FlutterwaveError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FlutterwaveError) {
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
