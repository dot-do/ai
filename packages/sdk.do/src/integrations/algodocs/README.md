# Algodocs Integration

AlgoDocs is an AI-powered platform that automates data extraction from business documents, offering fast, secure, and accurate processing without the need for templates or training.

**Category**: productivity
**Service**: Algodocs
**Base URL**: https://api.algodocs.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/algodocs](https://integrations.do/algodocs)

## Installation

```bash
npm install @dotdo/integration-algodocs
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-algodocs
```

## Quick Start

```typescript
import { AlgodocsClient } from '@dotdo/integration-algodocs'

// Initialize client
const client = new AlgodocsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new AlgodocsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Algodocs actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AlgodocsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AlgodocsError) {
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
