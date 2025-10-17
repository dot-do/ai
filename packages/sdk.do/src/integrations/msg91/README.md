# Msg91 Integration

MSG91 is a cloud communication platform offering secure and robust APIs for SMS, WhatsApp, Email, Voice, and more, enabling businesses to connect with their customers across multiple channels.

**Category**: productivity
**Service**: Msg91
**Base URL**: https://api.msg91.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/msg91](https://integrations.do/msg91)

## Installation

```bash
npm install @dotdo/integration-msg91
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-msg91
```

## Quick Start

```typescript
import { Msg91Client } from '@dotdo/integration-msg91'

// Initialize client
const client = new Msg91Client({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Msg91Client({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Msg91 actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Msg91Error` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Msg91Error) {
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
