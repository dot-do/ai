# Acculynx Integration

Using the AccuLynx API, data can be seamlessly exchanged between AccuLynx and other applications for greater efficiency and productivity.

**Category**: crm
**Service**: Acculynx
**Base URL**: https://api.acculynx.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/acculynx](https://integrations.do/acculynx)

## Installation

```bash
npm install @dotdo/integration-acculynx
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-acculynx
```

## Quick Start

```typescript
import { AcculynxClient } from '@dotdo/integration-acculynx'

// Initialize client
const client = new AcculynxClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AcculynxClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Acculynx actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AcculynxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AcculynxError) {
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
