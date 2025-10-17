# Google Meet Integration

Google Meet is a secure video conferencing platform that integrates with Google Workspace, facilitating remote meetings, screen sharing, and chat

**Category**: communication
**Service**: Googlemeet
**Base URL**: https://api.googlemeet.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googlemeet](https://integrations.do/googlemeet)

## Installation

```bash
npm install @dotdo/integration-googlemeet
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googlemeet
```

## Quick Start

```typescript
import { GooglemeetClient } from '@dotdo/integration-googlemeet'

// Initialize client
const client = new GooglemeetClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GooglemeetClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Meet actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GooglemeetError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GooglemeetError) {
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
