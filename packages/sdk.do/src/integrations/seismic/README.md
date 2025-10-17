# Seismic Integration

Seismic is a sales enablement platform offering content management, training, and analytics, ensuring sales teams have the right materials to close deals

**Category**: crm
**Service**: Seismic
**Base URL**: https://api.seismic.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/seismic](https://integrations.do/seismic)

## Installation

```bash
npm install @dotdo/integration-seismic
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-seismic
```

## Quick Start

```typescript
import { SeismicClient } from '@dotdo/integration-seismic'

// Initialize client
const client = new SeismicClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SeismicClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Seismic actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SeismicError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SeismicError) {
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
