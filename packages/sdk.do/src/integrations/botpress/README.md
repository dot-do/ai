# Botpress Integration

Botpress is an open-source platform for building, deploying, and managing chatbots.

**Category**: productivity
**Service**: Botpress
**Base URL**: https://api.botpress.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/botpress](https://integrations.do/botpress)

## Installation

```bash
npm install @dotdo/integration-botpress
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-botpress
```

## Quick Start

```typescript
import { BotpressClient } from '@dotdo/integration-botpress'

// Initialize client
const client = new BotpressClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BotpressClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Botpress actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BotpressError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BotpressError) {
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
