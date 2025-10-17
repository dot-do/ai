# Superchat Integration

Superchat is a unified messaging platform that enables businesses to communicate with customers across multiple channels, including WhatsApp, Instagram Direct, Facebook Messenger, Email, and more.

**Category**: productivity
**Service**: Superchat
**Base URL**: https://api.superchat.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/superchat](https://integrations.do/superchat)

## Installation

```bash
npm install @dotdo/integration-superchat
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-superchat
```

## Quick Start

```typescript
import { SuperchatClient } from '@dotdo/integration-superchat'

// Initialize client
const client = new SuperchatClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SuperchatClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Superchat actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SuperchatError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SuperchatError) {
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
