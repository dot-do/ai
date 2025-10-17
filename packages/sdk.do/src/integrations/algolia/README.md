# Algolia Integration

Algolia is a hosted search API that provides developers with tools to build fast and relevant search experiences for their applications.

**Category**: productivity
**Service**: Algolia
**Base URL**: https://api.algolia.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/algolia](https://integrations.do/algolia)

## Installation

```bash
npm install @dotdo/integration-algolia
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-algolia
```

## Quick Start

```typescript
import { AlgoliaClient } from '@dotdo/integration-algolia'

// Initialize client
const client = new AlgoliaClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new AlgoliaClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Algolia actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AlgoliaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AlgoliaError) {
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
