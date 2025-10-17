# Shopify Integration

Shopify is an e-commerce platform enabling merchants to create online stores, manage products, and process payments with themes, apps, and integrated marketing tools

**Category**: ecommerce
**Service**: Shopify
**Base URL**: https://api.shopify.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/shopify](https://integrations.do/shopify)

## Installation

```bash
npm install @dotdo/integration-shopify
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-shopify
```

## Quick Start

```typescript
import { ShopifyClient } from '@dotdo/integration-shopify'

// Initialize client
const client = new ShopifyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ShopifyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Shopify actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ShopifyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ShopifyError) {
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
