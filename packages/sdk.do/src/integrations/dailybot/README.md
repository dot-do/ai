# Dailybot Integration

DailyBot simplifies team collaboration and tasks with chat-based standups, reminders, polls, and integrations, streamlining workflow automation in popular messaging platforms

**Category**: communication
**Service**: Dailybot
**Base URL**: https://api.dailybot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dailybot](https://integrations.do/dailybot)

## Installation

```bash
npm install @dotdo/integration-dailybot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dailybot
```

## Quick Start

```typescript
import { DailybotClient } from '@dotdo/integration-dailybot'

// Initialize client
const client = new DailybotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DailybotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dailybot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DailybotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DailybotError) {
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
