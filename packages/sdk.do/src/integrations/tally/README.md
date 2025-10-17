# Tally Integration

Tally is a form-building platform that allows users to create forms, collect responses, and integrate with various tools and services.

**Category**: productivity
**Service**: Tally
**Base URL**: https://api.tally.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tally](https://integrations.do/tally)

## Installation

```bash
npm install @dotdo/integration-tally
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tally
```

## Quick Start

```typescript
import { TallyClient } from '@dotdo/integration-tally'

// Initialize client
const client = new TallyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TallyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Tally actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TallyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TallyError) {
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
