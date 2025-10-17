# Happy scribe Integration

Happy Scribe offers automatic and professional transcription services, converting audio and video files into text with high accuracy.

**Category**: productivity
**Service**: HappyScribe
**Base URL**: https://api.happy_scribe.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/happy_scribe](https://integrations.do/happy_scribe)

## Installation

```bash
npm install @dotdo/integration-happy_scribe
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-happy_scribe
```

## Quick Start

```typescript
import { HappyScribeClient } from '@dotdo/integration-happy_scribe'

// Initialize client
const client = new HappyScribeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HappyScribeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Happy scribe actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HappyScribeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HappyScribeError) {
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
