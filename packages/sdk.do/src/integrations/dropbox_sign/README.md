# Dropbox sign Integration

Dropbox Sign (formerly HelloSign) offers electronic signature and document workflow solutions, simplifying how businesses collect legally binding signatures online

**Category**: storage
**Service**: DropboxSign
**Base URL**: https://api.dropbox_sign.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dropbox_sign](https://integrations.do/dropbox_sign)

## Installation

```bash
npm install @dotdo/integration-dropbox_sign
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dropbox_sign
```

## Quick Start

```typescript
import { DropboxSignClient } from '@dotdo/integration-dropbox_sign'

// Initialize client
const client = new DropboxSignClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new DropboxSignClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Dropbox sign actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DropboxSignError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DropboxSignError) {
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
