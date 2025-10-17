# Share point Integration

SharePoint is a Microsoft platform for document management and intranets, enabling teams to collaborate, store, and organize content securely and effectively

**Category**: communication
**Service**: SharePoint
**Base URL**: https://api.share_point.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/share_point](https://integrations.do/share_point)

## Installation

```bash
npm install @dotdo/integration-share_point
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-share_point
```

## Quick Start

```typescript
import { SharePointClient } from '@dotdo/integration-share_point'

// Initialize client
const client = new SharePointClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SharePointClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Share point actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SharePointError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SharePointError) {
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
