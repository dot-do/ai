# Onedesk Integration

OneDesk is an all-in-one platform combining help desk and project management functionalities, enabling teams to manage customer support and project tasks seamlessly.

**Category**: productivity
**Service**: Onedesk
**Base URL**: https://api.onedesk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/onedesk](https://integrations.do/onedesk)

## Installation

```bash
npm install @dotdo/integration-onedesk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-onedesk
```

## Quick Start

```typescript
import { OnedeskClient } from '@dotdo/integration-onedesk'

// Initialize client
const client = new OnedeskClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OnedeskClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Onedesk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OnedeskError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OnedeskError) {
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
