# Zerobounce Integration

ZeroBounce is an email validation and deliverability platform that helps businesses improve email marketing performance by identifying and removing invalid or risky email addresses.

**Category**: productivity
**Service**: Zerobounce
**Base URL**: https://api.zerobounce.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zerobounce](https://integrations.do/zerobounce)

## Installation

```bash
npm install @dotdo/integration-zerobounce
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zerobounce
```

## Quick Start

```typescript
import { ZerobounceClient } from '@dotdo/integration-zerobounce'

// Initialize client
const client = new ZerobounceClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ZerobounceClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Zerobounce actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZerobounceError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZerobounceError) {
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
