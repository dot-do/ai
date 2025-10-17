# All images ai Integration

All-Images.ai provides AI-powered image generation, retrieval, and management services, enabling developers to create and manage images through advanced AI capabilities.

**Category**: productivity
**Service**: AllImagesAi
**Base URL**: https://api.all_images_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/all_images_ai](https://integrations.do/all_images_ai)

## Installation

```bash
npm install @dotdo/integration-all_images_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-all_images_ai
```

## Quick Start

```typescript
import { AllImagesAiClient } from '@dotdo/integration-all_images_ai'

// Initialize client
const client = new AllImagesAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AllImagesAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute All images ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AllImagesAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AllImagesAiError) {
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
