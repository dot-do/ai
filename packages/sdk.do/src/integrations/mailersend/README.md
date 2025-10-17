# Mailersend Integration

MailerSend is a transactional email service designed for developers to integrate email sending capabilities into their applications.

**Category**: productivity
**Service**: Mailersend
**Base URL**: https://api.mailersend.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mailersend](https://integrations.do/mailersend)

## Installation

```bash
npm install @dotdo/integration-mailersend
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mailersend
```

## Quick Start

```typescript
import { MailersendClient } from '@dotdo/integration-mailersend'

// Initialize client
const client = new MailersendClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MailersendClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mailersend actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MailersendError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MailersendError) {
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
