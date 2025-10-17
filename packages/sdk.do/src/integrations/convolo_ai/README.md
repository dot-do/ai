# Convolo ai Integration

Convolo.ai is an AI-powered communications platform designed to enhance sales calls and improve conversion rates through rapid lead response and integration capabilities.

**Category**: productivity
**Service**: ConvoloAi
**Base URL**: https://api.convolo_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/convolo_ai](https://integrations.do/convolo_ai)

## Installation

```bash
npm install @dotdo/integration-convolo_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-convolo_ai
```

## Quick Start

```typescript
import { ConvoloAiClient } from '@dotdo/integration-convolo_ai'

// Initialize client
const client = new ConvoloAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ConvoloAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Convolo ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ConvoloAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ConvoloAiError) {
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
