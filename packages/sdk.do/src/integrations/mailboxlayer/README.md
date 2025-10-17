# Mailboxlayer Integration

A simple REST-based JSON API for email address validation and verification.

**Category**: productivity
**Service**: Mailboxlayer
**Base URL**: https://api.mailboxlayer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mailboxlayer](https://integrations.do/mailboxlayer)

## Installation

```bash
npm install @dotdo/integration-mailboxlayer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mailboxlayer
```

## Quick Start

```typescript
import { MailboxlayerClient } from '@dotdo/integration-mailboxlayer'

// Initialize client
const client = new MailboxlayerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MailboxlayerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mailboxlayer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MailboxlayerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MailboxlayerError) {
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
