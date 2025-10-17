# Zoho books Integration

Zoho Books handles accounting, invoicing, and expense tracking, offering real-time collaboration and integrations within the Zoho ecosystem

**Category**: accounting
**Service**: ZohoBooks
**Base URL**: https://api.zoho_books.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoho_books](https://integrations.do/zoho_books)

## Installation

```bash
npm install @dotdo/integration-zoho_books
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoho_books
```

## Quick Start

```typescript
import { ZohoBooksClient } from '@dotdo/integration-zoho_books'

// Initialize client
const client = new ZohoBooksClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ZohoBooksClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Zoho books actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZohoBooksError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZohoBooksError) {
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
