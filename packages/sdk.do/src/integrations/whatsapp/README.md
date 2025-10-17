# Whatsapp Integration

Enables interaction with customers through the WhatsApp Business API for messaging and automation. Only supports WhatsApp Business accounts, not WhatsApp Personal accounts.

**Category**: productivity
**Service**: Whatsapp
**Base URL**: https://api.whatsapp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/whatsapp](https://integrations.do/whatsapp)

## Installation

```bash
npm install @dotdo/integration-whatsapp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-whatsapp
```

## Quick Start

```typescript
import { WhatsappClient } from '@dotdo/integration-whatsapp'

// Initialize client
const client = new WhatsappClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new WhatsappClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Whatsapp actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WhatsappError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WhatsappError) {
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
