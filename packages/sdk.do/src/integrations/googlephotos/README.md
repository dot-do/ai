# Googlephotos Integration

Google Photos is a cloud-based photo storage and organization service offering automatic backups, AI-assisted search, and shared albums for personal and collaborative media management

**Category**: storage
**Service**: Googlephotos
**Base URL**: https://api.googlephotos.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googlephotos](https://integrations.do/googlephotos)

## Installation

```bash
npm install @dotdo/integration-googlephotos
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googlephotos
```

## Quick Start

```typescript
import { GooglephotosClient } from '@dotdo/integration-googlephotos'

// Initialize client
const client = new GooglephotosClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GooglephotosClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Googlephotos actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GooglephotosError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GooglephotosError) {
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
