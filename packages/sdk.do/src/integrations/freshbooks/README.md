# Freshbooks Integration

FreshBooks is a cloud-based accounting software service designed for small and medium-sized businesses, offering features like invoicing, expense tracking, and time management.

**Category**: productivity
**Service**: Freshbooks
**Base URL**: https://api.freshbooks.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/freshbooks](https://integrations.do/freshbooks)

## Installation

```bash
npm install @dotdo/integration-freshbooks
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-freshbooks
```

## Quick Start

```typescript
import { FreshbooksClient } from '@dotdo/integration-freshbooks'

// Initialize client
const client = new FreshbooksClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new FreshbooksClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Freshbooks actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FreshbooksError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FreshbooksError) {
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
