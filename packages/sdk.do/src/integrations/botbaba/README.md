# Botbaba Integration

Botbaba provides APIs for building and managing chatbots, including conversational AI and messaging integrations.

**Category**: developer-tools
**Service**: Botbaba
**Base URL**: https://api.botbaba.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/botbaba](https://integrations.do/botbaba)

## Installation

```bash
npm install @dotdo/integration-botbaba
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-botbaba
```

## Quick Start

```typescript
import { BotbabaClient } from '@dotdo/integration-botbaba'

// Initialize client
const client = new BotbabaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BotbabaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Botbaba actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BotbabaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BotbabaError) {
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
