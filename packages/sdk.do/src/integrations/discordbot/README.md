# Discordbot Integration

Discordbot refers to automated programs on Discord servers, performing tasks like moderation, music playback, and user engagement to enhance community interactions

**Category**: communication
**Service**: Discordbot
**Base URL**: https://api.discordbot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/discordbot](https://integrations.do/discordbot)

## Installation

```bash
npm install @dotdo/integration-discordbot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-discordbot
```

## Quick Start

```typescript
import { DiscordbotClient } from '@dotdo/integration-discordbot'

// Initialize client
const client = new DiscordbotClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new DiscordbotClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Discordbot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DiscordbotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DiscordbotError) {
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
