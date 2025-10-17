# Kit Integration

Kit is a platform that allows creators to automate tasks and developers to build apps for the Kit App Store.

**Category**: productivity
**Service**: Kit
**Base URL**: https://api.kit.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/kit](https://integrations.do/kit)

## Installation

```bash
npm install @dotdo/integration-kit
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-kit
```

## Quick Start

```typescript
import { KitClient } from '@dotdo/integration-kit'

// Initialize client
const client = new KitClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new KitClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Kit actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KitError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KitError) {
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
