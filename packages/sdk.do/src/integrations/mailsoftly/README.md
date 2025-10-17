# Mailsoftly Integration

Mailsoftly is an intuitive email marketing platform designed to simplify and enhance how businesses communicate with their audiences. Built with user-friendly features and advanced automation tools, Mailsoftly helps organizations to create, schedule, and manage email campaigns easily.

**Category**: productivity
**Service**: Mailsoftly
**Base URL**: https://api.mailsoftly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mailsoftly](https://integrations.do/mailsoftly)

## Installation

```bash
npm install @dotdo/integration-mailsoftly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mailsoftly
```

## Quick Start

```typescript
import { MailsoftlyClient } from '@dotdo/integration-mailsoftly'

// Initialize client
const client = new MailsoftlyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MailsoftlyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mailsoftly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MailsoftlyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MailsoftlyError) {
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
