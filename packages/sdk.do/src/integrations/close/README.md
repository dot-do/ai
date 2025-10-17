# Close Integration

Close is a CRM platform designed to help businesses manage and streamline their sales processes, including calling, email automation, and predictive dialers.

**Category**: crm
**Service**: Close
**Base URL**: https://api.close.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/close](https://integrations.do/close)

## Installation

```bash
npm install @dotdo/integration-close
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-close
```

## Quick Start

```typescript
import { CloseClient } from '@dotdo/integration-close'

// Initialize client
const client = new CloseClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CloseClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Close actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CloseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CloseError) {
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
