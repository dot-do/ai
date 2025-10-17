# Go to webinar Integration

GoToWebinar is a webinar hosting platform that enables businesses to create live and automated online events, engage audiences, and gather analytics for lead nurturing

**Category**: communication
**Service**: GoToWebinar
**Base URL**: https://api.go_to_webinar.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/go_to_webinar](https://integrations.do/go_to_webinar)

## Installation

```bash
npm install @dotdo/integration-go_to_webinar
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-go_to_webinar
```

## Quick Start

```typescript
import { GoToWebinarClient } from '@dotdo/integration-go_to_webinar'

// Initialize client
const client = new GoToWebinarClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoToWebinarClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Go to webinar actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoToWebinarError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoToWebinarError) {
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
