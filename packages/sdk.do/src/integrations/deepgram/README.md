# Deepgram Integration

Deepgram provides AI-powered speech recognition and understanding services, offering APIs for real-time and pre-recorded audio transcription, text-to-speech, and audio intelligence.

**Category**: productivity
**Service**: Deepgram
**Base URL**: https://api.deepgram.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/deepgram](https://integrations.do/deepgram)

## Installation

```bash
npm install @dotdo/integration-deepgram
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-deepgram
```

## Quick Start

```typescript
import { DeepgramClient } from '@dotdo/integration-deepgram'

// Initialize client
const client = new DeepgramClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DeepgramClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Deepgram actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DeepgramError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DeepgramError) {
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
