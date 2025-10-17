# Emailable Integration

Emailable provides an email verification API that allows developers to integrate real-time email validation into their applications, ensuring the accuracy and deliverability of email addresses.

**Category**: productivity
**Service**: Emailable
**Base URL**: https://api.emailable.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/emailable](https://integrations.do/emailable)

## Installation

```bash
npm install @dotdo/integration-emailable
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-emailable
```

## Quick Start

```typescript
import { EmailableClient } from '@dotdo/integration-emailable'

// Initialize client
const client = new EmailableClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EmailableClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Emailable actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EmailableError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EmailableError) {
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
