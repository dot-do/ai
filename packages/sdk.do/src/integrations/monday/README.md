# Monday Integration

monday.com is a customizable work management platform for project planning, collaboration, and automation, supporting agile, sales, marketing, and more

**Category**: productivity
**Service**: Monday
**Base URL**: https://api.monday.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/monday](https://integrations.do/monday)

## Installation

```bash
npm install @dotdo/integration-monday
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-monday
```

## Quick Start

```typescript
import { MondayClient } from '@dotdo/integration-monday'

// Initialize client
const client = new MondayClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new MondayClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Monday actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MondayError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MondayError) {
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
