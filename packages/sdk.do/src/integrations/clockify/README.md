# Clockify Integration

Clockify is a free time tracking software that allows individuals and teams to track work hours across projects.

**Category**: productivity
**Service**: Clockify
**Base URL**: https://api.clockify.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/clockify](https://integrations.do/clockify)

## Installation

```bash
npm install @dotdo/integration-clockify
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-clockify
```

## Quick Start

```typescript
import { ClockifyClient } from '@dotdo/integration-clockify'

// Initialize client
const client = new ClockifyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ClockifyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Clockify actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ClockifyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ClockifyError) {
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
