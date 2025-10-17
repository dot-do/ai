# Timecamp Integration

TimeCamp is a time tracking solution designed to help businesses of all sizes track time for projects to maximize their profits.

**Category**: productivity
**Service**: Timecamp
**Base URL**: https://api.timecamp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/timecamp](https://integrations.do/timecamp)

## Installation

```bash
npm install @dotdo/integration-timecamp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-timecamp
```

## Quick Start

```typescript
import { TimecampClient } from '@dotdo/integration-timecamp'

// Initialize client
const client = new TimecampClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TimecampClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Timecamp actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TimecampError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TimecampError) {
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
