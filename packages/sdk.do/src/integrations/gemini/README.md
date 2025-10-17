# Gemini Integration

Comprehensive Gemini integration supporting Veo 3 video generation, Gemini Flash text generation (Nano Banana), chat completions, and multimodal AI capabilities via the Google Gemini API.

**Category**: productivity
**Service**: Gemini
**Base URL**: https://api.gemini.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gemini](https://integrations.do/gemini)

## Installation

```bash
npm install @dotdo/integration-gemini
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gemini
```

## Quick Start

```typescript
import { GeminiClient } from '@dotdo/integration-gemini'

// Initialize client
const client = new GeminiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GeminiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Gemini actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GeminiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GeminiError) {
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
