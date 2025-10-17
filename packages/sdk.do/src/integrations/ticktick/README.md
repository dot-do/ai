# Ticktick Integration

TickTick is a cross-platform task management and to-do list application designed to help users organize their tasks and schedules efficiently.

**Category**: productivity
**Service**: Ticktick
**Base URL**: https://api.ticktick.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ticktick](https://integrations.do/ticktick)

## Installation

```bash
npm install @dotdo/integration-ticktick
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ticktick
```

## Quick Start

```typescript
import { TicktickClient } from '@dotdo/integration-ticktick'

// Initialize client
const client = new TicktickClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TicktickClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Ticktick actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TicktickError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TicktickError) {
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
