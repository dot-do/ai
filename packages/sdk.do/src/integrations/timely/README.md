# Timely Integration

Timely is an automatic time-tracking platform capturing activity across applications, calendars, and devices, creating detailed timesheets for billing or productivity insights

**Category**: productivity
**Service**: Timely
**Base URL**: https://api.timely.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/timely](https://integrations.do/timely)

## Installation

```bash
npm install @dotdo/integration-timely
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-timely
```

## Quick Start

```typescript
import { TimelyClient } from '@dotdo/integration-timely'

// Initialize client
const client = new TimelyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TimelyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Timely actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TimelyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TimelyError) {
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
