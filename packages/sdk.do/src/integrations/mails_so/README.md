# Mails so Integration

Mails is an API service that provides powerful email validation capabilities to help maintain a clean and effective email list.

**Category**: productivity
**Service**: MailsSo
**Base URL**: https://api.mails_so.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mails_so](https://integrations.do/mails_so)

## Installation

```bash
npm install @dotdo/integration-mails_so
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mails_so
```

## Quick Start

```typescript
import { MailsSoClient } from '@dotdo/integration-mails_so'

// Initialize client
const client = new MailsSoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MailsSoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mails so actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MailsSoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MailsSoError) {
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
