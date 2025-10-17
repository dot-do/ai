# Kommo Integration

Kommo CRM (formerly amoCRM) integration tool for managing customer relationships, sales pipelines, and business processes.

**Category**: crm
**Service**: Kommo
**Base URL**: https://api.kommo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/kommo](https://integrations.do/kommo)

## Installation

```bash
npm install @dotdo/integration-kommo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-kommo
```

## Quick Start

```typescript
import { KommoClient } from '@dotdo/integration-kommo'

// Initialize client
const client = new KommoClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new KommoClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Kommo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KommoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KommoError) {
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
