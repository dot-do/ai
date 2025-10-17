# Asin data api Integration

ASIN Data API provides detailed product data from Amazon, including price, rank, reviews, and more, enabling real-time insights for e-commerce professionals, marketers, and data analysts.

**Category**: ecommerce
**Service**: AsinDataApi
**Base URL**: https://api.asin_data_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/asin_data_api](https://integrations.do/asin_data_api)

## Installation

```bash
npm install @dotdo/integration-asin_data_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-asin_data_api
```

## Quick Start

```typescript
import { AsinDataApiClient } from '@dotdo/integration-asin_data_api'

// Initialize client
const client = new AsinDataApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AsinDataApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Asin data api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AsinDataApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AsinDataApiError) {
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
