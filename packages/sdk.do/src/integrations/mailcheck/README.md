# Mailcheck Integration

Mailcheck is an email verification service that helps businesses validate email addresses to ensure deliverability and reduce bounce rates.

**Category**: productivity
**Service**: Mailcheck
**Base URL**: https://api.mailcheck.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mailcheck](https://integrations.do/mailcheck)

## Installation

```bash
npm install @dotdo/integration-mailcheck
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mailcheck
```

## Quick Start

```typescript
import { MailcheckClient } from '@dotdo/integration-mailcheck'

// Initialize client
const client = new MailcheckClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MailcheckClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mailcheck actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MailcheckError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MailcheckError) {
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
