# Emailoctopus Integration

EmailOctopus is an email marketing platform founded in 2015, offering affordable and intuitive solutions for individuals and businesses to connect with their subscribers.

**Category**: productivity
**Service**: Emailoctopus
**Base URL**: https://api.emailoctopus.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/emailoctopus](https://integrations.do/emailoctopus)

## Installation

```bash
npm install @dotdo/integration-emailoctopus
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-emailoctopus
```

## Quick Start

```typescript
import { EmailoctopusClient } from '@dotdo/integration-emailoctopus'

// Initialize client
const client = new EmailoctopusClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EmailoctopusClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Emailoctopus actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EmailoctopusError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EmailoctopusError) {
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
