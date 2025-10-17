# Dpd2 Integration

Template description for dpd2

**Category**: productivity
**Service**: Dpd2
**Base URL**: https://api.dpd2.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dpd2](https://integrations.do/dpd2)

## Installation

```bash
npm install @dotdo/integration-dpd2
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dpd2
```

## Quick Start

```typescript
import { Dpd2Client } from '@dotdo/integration-dpd2'

// Initialize client
const client = new Dpd2Client({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Dpd2Client({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dpd2 actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Dpd2Error` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Dpd2Error) {
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
