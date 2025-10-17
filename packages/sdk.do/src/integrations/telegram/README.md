# Telegram Integration

Telegram is a cloud-based messaging app with a focus on security and speed. Build bots to send messages, manage chats, and interact with users.

**Category**: productivity
**Service**: Telegram
**Base URL**: https://api.telegram.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/telegram](https://integrations.do/telegram)

## Installation

```bash
npm install @dotdo/integration-telegram
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-telegram
```

## Quick Start

```typescript
import { TelegramClient } from '@dotdo/integration-telegram'

// Initialize client
const client = new TelegramClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TelegramClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Telegram actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TelegramError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TelegramError) {
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
