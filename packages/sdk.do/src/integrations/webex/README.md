# Webex Integration

Webex is a Cisco-powered video conferencing and collaboration platform offering online meetings, webinars, screen sharing, and team messaging

**Category**: communication
**Service**: Webex
**Base URL**: https://api.webex.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/webex](https://integrations.do/webex)

## Installation

```bash
npm install @dotdo/integration-webex
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-webex
```

## Quick Start

```typescript
import { WebexClient } from '@dotdo/integration-webex'

// Initialize client
const client = new WebexClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new WebexClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Webex actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WebexError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WebexError) {
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
