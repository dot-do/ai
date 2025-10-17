# Zoho inventory Integration

Zoho Inventory helps businesses track stock, manage orders, and sync inventory across multiple sales channels, streamlining supply chain operations

**Category**: accounting
**Service**: ZohoInventory
**Base URL**: https://api.zoho_inventory.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoho_inventory](https://integrations.do/zoho_inventory)

## Installation

```bash
npm install @dotdo/integration-zoho_inventory
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoho_inventory
```

## Quick Start

```typescript
import { ZohoInventoryClient } from '@dotdo/integration-zoho_inventory'

// Initialize client
const client = new ZohoInventoryClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ZohoInventoryClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Zoho inventory actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZohoInventoryError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZohoInventoryError) {
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
