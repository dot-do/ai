# Zoho invoice Integration

Zoho Invoice simplifies billing, recurring payments, and expense management, helping freelancers and small businesses send professional invoices

**Category**: accounting
**Service**: ZohoInvoice
**Base URL**: https://api.zoho_invoice.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoho_invoice](https://integrations.do/zoho_invoice)

## Installation

```bash
npm install @dotdo/integration-zoho_invoice
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoho_invoice
```

## Quick Start

```typescript
import { ZohoInvoiceClient } from '@dotdo/integration-zoho_invoice'

// Initialize client
const client = new ZohoInvoiceClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ZohoInvoiceClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Zoho invoice actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZohoInvoiceError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZohoInvoiceError) {
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
