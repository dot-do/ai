# Moosend Integration

Moosend is a cloud-based, AI-powered email marketing solution that allows you to target your audience at scale.

**Category**: productivity
**Service**: Moosend
**Base URL**: https://api.moosend.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/moosend](https://integrations.do/moosend)

## Installation

```bash
npm install @dotdo/integration-moosend
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-moosend
```

## Quick Start

```typescript
import { MoosendClient } from '@dotdo/integration-moosend'

// Initialize client
const client = new MoosendClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MoosendClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Moosend actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MoosendError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MoosendError) {
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
