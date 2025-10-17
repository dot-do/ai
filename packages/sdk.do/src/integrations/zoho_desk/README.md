# Zoho desk Integration

Zoho Desk is a context-aware helpdesk platform enabling support teams to track tickets, automate workflows, and gain insights on customer interactions

**Category**: crm
**Service**: ZohoDesk
**Base URL**: https://api.zoho_desk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoho_desk](https://integrations.do/zoho_desk)

## Installation

```bash
npm install @dotdo/integration-zoho_desk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoho_desk
```

## Quick Start

```typescript
import { ZohoDeskClient } from '@dotdo/integration-zoho_desk'

// Initialize client
const client = new ZohoDeskClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ZohoDeskClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Zoho desk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZohoDeskError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZohoDeskError) {
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
