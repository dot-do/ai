# Mailbluster Integration

MailBluster is an advanced, reliable, and cost-effective email marketing software that enables sending personalized promotional emails to millions.

**Category**: productivity
**Service**: Mailbluster
**Base URL**: https://api.mailbluster.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mailbluster](https://integrations.do/mailbluster)

## Installation

```bash
npm install @dotdo/integration-mailbluster
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mailbluster
```

## Quick Start

```typescript
import { MailblusterClient } from '@dotdo/integration-mailbluster'

// Initialize client
const client = new MailblusterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MailblusterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mailbluster actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MailblusterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MailblusterError) {
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
