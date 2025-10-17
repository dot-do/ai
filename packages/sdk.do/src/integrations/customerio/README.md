# Customerio Integration

Customer.io is a customer engagement platform that enables businesses to send targeted messages to their customers through various channels, including email, SMS, and push notifications.

**Category**: productivity
**Service**: Customerio
**Base URL**: https://api.customerio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/customerio](https://integrations.do/customerio)

## Installation

```bash
npm install @dotdo/integration-customerio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-customerio
```

## Quick Start

```typescript
import { CustomerioClient } from '@dotdo/integration-customerio'

// Initialize client
const client = new CustomerioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CustomerioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Customerio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CustomerioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CustomerioError) {
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
