# Userlist Integration

Userlist is a full-stack email automation platform designed for SaaS companies, enabling targeted behavior-based campaigns through email and in-app messages.

**Category**: productivity
**Service**: Userlist
**Base URL**: https://api.userlist.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/userlist](https://integrations.do/userlist)

## Installation

```bash
npm install @dotdo/integration-userlist
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-userlist
```

## Quick Start

```typescript
import { UserlistClient } from '@dotdo/integration-userlist'

// Initialize client
const client = new UserlistClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new UserlistClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Userlist actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `UserlistError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof UserlistError) {
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
