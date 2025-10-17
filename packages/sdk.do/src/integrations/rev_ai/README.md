# Rev ai Integration

Rev AI provides advanced machine learning and speech recognition services for converting audio and video to text.

**Category**: productivity
**Service**: RevAi
**Base URL**: https://api.rev_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/rev_ai](https://integrations.do/rev_ai)

## Installation

```bash
npm install @dotdo/integration-rev_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-rev_ai
```

## Quick Start

```typescript
import { RevAiClient } from '@dotdo/integration-rev_ai'

// Initialize client
const client = new RevAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RevAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Rev ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RevAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RevAiError) {
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
