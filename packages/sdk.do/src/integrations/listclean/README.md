# Listclean Integration

Listclean is an email verification service that helps users validate and clean their email lists to improve deliverability and maintain sender reputation.

**Category**: productivity
**Service**: Listclean
**Base URL**: https://api.listclean.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/listclean](https://integrations.do/listclean)

## Installation

```bash
npm install @dotdo/integration-listclean
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-listclean
```

## Quick Start

```typescript
import { ListcleanClient } from '@dotdo/integration-listclean'

// Initialize client
const client = new ListcleanClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ListcleanClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Listclean actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ListcleanError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ListcleanError) {
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
