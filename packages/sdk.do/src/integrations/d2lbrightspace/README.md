# D2lbrightspace Integration

D2L Brightspace is a learning management system that provides a comprehensive suite of tools for educators to create, manage, and deliver online courses and learning experiences.

**Category**: productivity
**Service**: D2lbrightspace
**Base URL**: https://api.d2lbrightspace.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/d2lbrightspace](https://integrations.do/d2lbrightspace)

## Installation

```bash
npm install @dotdo/integration-d2lbrightspace
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-d2lbrightspace
```

## Quick Start

```typescript
import { D2lbrightspaceClient } from '@dotdo/integration-d2lbrightspace'

// Initialize client
const client = new D2lbrightspaceClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new D2lbrightspaceClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute D2lbrightspace actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `D2lbrightspaceError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof D2lbrightspaceError) {
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
