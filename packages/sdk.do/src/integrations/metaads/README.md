# Metaads Integration

Meta Ads API

**Category**: productivity
**Service**: Metaads
**Base URL**: https://api.metaads.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/metaads](https://integrations.do/metaads)

## Installation

```bash
npm install @dotdo/integration-metaads
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-metaads
```

## Quick Start

```typescript
import { MetaadsClient } from '@dotdo/integration-metaads'

// Initialize client
const client = new MetaadsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new MetaadsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Metaads actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MetaadsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MetaadsError) {
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
