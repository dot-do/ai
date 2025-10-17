# Dialmycalls Integration

DialMyCalls provides a mass notification system enabling users to send voice and text messages to contacts.

**Category**: productivity
**Service**: Dialmycalls
**Base URL**: https://api.dialmycalls.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dialmycalls](https://integrations.do/dialmycalls)

## Installation

```bash
npm install @dotdo/integration-dialmycalls
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dialmycalls
```

## Quick Start

```typescript
import { DialmycallsClient } from '@dotdo/integration-dialmycalls'

// Initialize client
const client = new DialmycallsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DialmycallsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dialmycalls actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DialmycallsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DialmycallsError) {
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
