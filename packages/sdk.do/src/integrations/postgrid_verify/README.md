# Postgrid verify Integration

PostGrid Verify is an API that allows you to autocomplete, verify, and standardize addresses in real-time, supporting both individual and batch address verification.

**Category**: productivity
**Service**: PostgridVerify
**Base URL**: https://api.postgrid_verify.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/postgrid_verify](https://integrations.do/postgrid_verify)

## Installation

```bash
npm install @dotdo/integration-postgrid_verify
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-postgrid_verify
```

## Quick Start

```typescript
import { PostgridVerifyClient } from '@dotdo/integration-postgrid_verify'

// Initialize client
const client = new PostgridVerifyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PostgridVerifyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Postgrid verify actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PostgridVerifyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PostgridVerifyError) {
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
