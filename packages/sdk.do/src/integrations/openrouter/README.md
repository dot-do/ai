# Openrouter Integration

OpenRouter is a platform that provides a unified API for accessing various large language models (LLMs) from different providers, allowing developers to integrate multiple AI models seamlessly.

**Category**: productivity
**Service**: Openrouter
**Base URL**: https://api.openrouter.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/openrouter](https://integrations.do/openrouter)

## Installation

```bash
npm install @dotdo/integration-openrouter
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-openrouter
```

## Quick Start

```typescript
import { OpenrouterClient } from '@dotdo/integration-openrouter'

// Initialize client
const client = new OpenrouterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OpenrouterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Openrouter actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OpenrouterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OpenrouterError) {
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
