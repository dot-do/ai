# Linkhut Integration

LinkHut manages bookmarked links in a minimalistic, shareable interface, helping teams organize URLs and track references in one place

**Category**: productivity
**Service**: Linkhut
**Base URL**: https://api.linkhut.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/linkhut](https://integrations.do/linkhut)

## Installation

```bash
npm install @dotdo/integration-linkhut
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-linkhut
```

## Quick Start

```typescript
import { LinkhutClient } from '@dotdo/integration-linkhut'

// Initialize client
const client = new LinkhutClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new LinkhutClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Linkhut actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LinkhutError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LinkhutError) {
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
