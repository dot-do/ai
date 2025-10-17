# Bigmailer Integration

BigMailer is an email marketing platform designed for managing multiple brands, offering features like white-labeling, automation, and integration with Amazon SES.

**Category**: productivity
**Service**: Bigmailer
**Base URL**: https://api.bigmailer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bigmailer](https://integrations.do/bigmailer)

## Installation

```bash
npm install @dotdo/integration-bigmailer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bigmailer
```

## Quick Start

```typescript
import { BigmailerClient } from '@dotdo/integration-bigmailer'

// Initialize client
const client = new BigmailerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BigmailerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bigmailer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BigmailerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BigmailerError) {
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
