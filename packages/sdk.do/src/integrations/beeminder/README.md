# Beeminder Integration

Beeminder is an online goal-tracking service that uses financial incentives—pledge money on your objectives and forfeit it if you don’t keep up—to help you achieve your goals.

**Category**: productivity
**Service**: Beeminder
**Base URL**: https://api.beeminder.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/beeminder](https://integrations.do/beeminder)

## Installation

```bash
npm install @dotdo/integration-beeminder
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-beeminder
```

## Quick Start

```typescript
import { BeeminderClient } from '@dotdo/integration-beeminder'

// Initialize client
const client = new BeeminderClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BeeminderClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Beeminder actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BeeminderError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BeeminderError) {
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
