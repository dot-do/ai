# Thanks io Integration

thanks.io is a direct mail automation platform that enables users to send personalized postcards, letters, and notecards with handwritten fonts.

**Category**: productivity
**Service**: ThanksIo
**Base URL**: https://api.thanks_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/thanks_io](https://integrations.do/thanks_io)

## Installation

```bash
npm install @dotdo/integration-thanks_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-thanks_io
```

## Quick Start

```typescript
import { ThanksIoClient } from '@dotdo/integration-thanks_io'

// Initialize client
const client = new ThanksIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ThanksIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Thanks io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ThanksIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ThanksIoError) {
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
