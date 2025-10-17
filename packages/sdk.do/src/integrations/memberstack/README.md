# Memberstack Integration

Memberstack is a platform that enables developers to add user authentication, payments, and member management to their websites without writing backend code.

**Category**: productivity
**Service**: Memberstack
**Base URL**: https://api.memberstack.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/memberstack](https://integrations.do/memberstack)

## Installation

```bash
npm install @dotdo/integration-memberstack
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-memberstack
```

## Quick Start

```typescript
import { MemberstackClient } from '@dotdo/integration-memberstack'

// Initialize client
const client = new MemberstackClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MemberstackClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Memberstack actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MemberstackError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MemberstackError) {
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
