# Customer io Integration

Customer.io is a customer engagement platform providing automated messaging, segmentation, and personalized campaigns through email, SMS, and push notifications to boost conversions

**Category**: marketing
**Service**: CustomerIo
**Base URL**: https://api.customer_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/customer_io](https://integrations.do/customer_io)

## Installation

```bash
npm install @dotdo/integration-customer_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-customer_io
```

## Quick Start

```typescript
import { CustomerIoClient } from '@dotdo/integration-customer_io'

// Initialize client
const client = new CustomerIoClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new CustomerIoClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Customer io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CustomerIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CustomerIoError) {
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
