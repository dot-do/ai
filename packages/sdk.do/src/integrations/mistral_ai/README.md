# Mistral ai Integration

Mistral AI is a research lab building state-of-the-art open-source language models and providing APIs for developers and enterprises to integrate these models into their applications.

**Category**: productivity
**Service**: MistralAi
**Base URL**: https://api.mistral_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mistral_ai](https://integrations.do/mistral_ai)

## Installation

```bash
npm install @dotdo/integration-mistral_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mistral_ai
```

## Quick Start

```typescript
import { MistralAiClient } from '@dotdo/integration-mistral_ai'

// Initialize client
const client = new MistralAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MistralAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mistral ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MistralAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MistralAiError) {
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
