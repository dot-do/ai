# Dropbox Integration

Dropbox is a cloud storage service offering file syncing, sharing, and collaboration across devices with version control and robust integrations

**Category**: storage
**Service**: Dropbox
**Base URL**: https://api.dropbox.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dropbox](https://integrations.do/dropbox)

## Installation

```bash
npm install @dotdo/integration-dropbox
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dropbox
```

## Quick Start

```typescript
import { DropboxClient } from '@dotdo/integration-dropbox'

// Initialize client
const client = new DropboxClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new DropboxClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Dropbox actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DropboxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DropboxError) {
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
