# Google Tasks Integration

Google Tasks provides a simple to-do list and task management system integrated into Gmail and Google Calendar for quick and easy tracking

**Category**: productivity
**Service**: Googletasks
**Base URL**: https://api.googletasks.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googletasks](https://integrations.do/googletasks)

## Installation

```bash
npm install @dotdo/integration-googletasks
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googletasks
```

## Quick Start

```typescript
import { GoogletasksClient } from '@dotdo/integration-googletasks'

// Initialize client
const client = new GoogletasksClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogletasksClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Tasks actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogletasksError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogletasksError) {
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
