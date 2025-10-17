# Smtp2go Integration

SMTP2GO is a reliable email delivery service that ensures your emails reach recipients' inboxes efficiently.

**Category**: productivity
**Service**: Smtp2go
**Base URL**: https://api.smtp2go.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/smtp2go](https://integrations.do/smtp2go)

## Installation

```bash
npm install @dotdo/integration-smtp2go
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-smtp2go
```

## Quick Start

```typescript
import { Smtp2goClient } from '@dotdo/integration-smtp2go'

// Initialize client
const client = new Smtp2goClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Smtp2goClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Smtp2go actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Smtp2goError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Smtp2goError) {
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
