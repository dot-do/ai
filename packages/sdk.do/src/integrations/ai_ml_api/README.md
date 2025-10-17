# Ai ml api Integration

AI/ML API provides a suite of AI models and solutions for various tasks, including text generation, image processing, and more.

**Category**: productivity
**Service**: AiMlApi
**Base URL**: https://api.ai_ml_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ai_ml_api](https://integrations.do/ai_ml_api)

## Installation

```bash
npm install @dotdo/integration-ai_ml_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ai_ml_api
```

## Quick Start

```typescript
import { AiMlApiClient } from '@dotdo/integration-ai_ml_api'

// Initialize client
const client = new AiMlApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AiMlApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ai ml api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AiMlApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AiMlApiError) {
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
