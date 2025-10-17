# Mailerlite Integration

MailerLite is an email marketing service that offers tools for creating and managing email campaigns, automating workflows, and building landing pages.

**Category**: productivity
**Service**: Mailerlite
**Base URL**: https://api.mailerlite.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mailerlite](https://integrations.do/mailerlite)

## Installation

```bash
npm install @dotdo/integration-mailerlite
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mailerlite
```

## Quick Start

```typescript
import { MailerliteClient } from '@dotdo/integration-mailerlite'

// Initialize client
const client = new MailerliteClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MailerliteClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mailerlite actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MailerliteError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MailerliteError) {
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
