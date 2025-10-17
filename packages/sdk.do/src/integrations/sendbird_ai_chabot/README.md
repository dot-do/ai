# Sendbird ai chabot Integration

Sendbird's AI Chatbot enables businesses to integrate intelligent, automated conversational agents into their applications, enhancing customer engagement and support.

**Category**: productivity
**Service**: SendbirdAiChabot
**Base URL**: https://api.sendbird_ai_chabot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sendbird_ai_chabot](https://integrations.do/sendbird_ai_chabot)

## Installation

```bash
npm install @dotdo/integration-sendbird_ai_chabot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sendbird_ai_chabot
```

## Quick Start

```typescript
import { SendbirdAiChabotClient } from '@dotdo/integration-sendbird_ai_chabot'

// Initialize client
const client = new SendbirdAiChabotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SendbirdAiChabotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sendbird ai chabot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SendbirdAiChabotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SendbirdAiChabotError) {
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
