# Confluence Integration

A tool for team collaboration and knowledge management.

**Category**: productivity
**Service**: Confluence
**Base URL**: https://api.confluence.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/confluence](https://integrations.do/confluence)

## Installation

```bash
npm install @dotdo/integration-confluence
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-confluence
```

## Quick Start

```typescript
import { ConfluenceClient } from '@dotdo/integration-confluence'

// Initialize client
const client = new ConfluenceClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ConfluenceClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Confluence actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ConfluenceError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ConfluenceError) {
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
