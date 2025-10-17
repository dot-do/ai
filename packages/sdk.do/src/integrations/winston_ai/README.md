# Winston ai Integration

Winston AI provides a comprehensive content verification and management platform, offering tools for AI-generated text detection, plagiarism detection, and AI image detection.

**Category**: productivity
**Service**: WinstonAi
**Base URL**: https://api.winston_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/winston_ai](https://integrations.do/winston_ai)

## Installation

```bash
npm install @dotdo/integration-winston_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-winston_ai
```

## Quick Start

```typescript
import { WinstonAiClient } from '@dotdo/integration-winston_ai'

// Initialize client
const client = new WinstonAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WinstonAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Winston ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WinstonAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WinstonAiError) {
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
