# Productlane Integration

Productlane is a customer support and feedback system designed for modern companies, built on Linear.

**Category**: productivity
**Service**: Productlane
**Base URL**: https://api.productlane.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/productlane](https://integrations.do/productlane)

## Installation

```bash
npm install @dotdo/integration-productlane
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-productlane
```

## Quick Start

```typescript
import { ProductlaneClient } from '@dotdo/integration-productlane'

// Initialize client
const client = new ProductlaneClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ProductlaneClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Productlane actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ProductlaneError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ProductlaneError) {
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
