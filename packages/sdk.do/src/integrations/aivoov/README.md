# Aivoov Integration

AiVOOV is an AI-driven text-to-speech platform that converts written text into natural-sounding voiceovers, offering over 1,000 voices across 150+ languages.

**Category**: productivity
**Service**: Aivoov
**Base URL**: https://api.aivoov.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/aivoov](https://integrations.do/aivoov)

## Installation

```bash
npm install @dotdo/integration-aivoov
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-aivoov
```

## Quick Start

```typescript
import { AivoovClient } from '@dotdo/integration-aivoov'

// Initialize client
const client = new AivoovClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AivoovClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Aivoov actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AivoovError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AivoovError) {
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
