# Gan ai Integration

Gan.AI provides advanced APIs for text-to-speech, voice cloning, and video personalization, enabling developers to integrate natural and expressive speech synthesis into their applications.

**Category**: productivity
**Service**: GanAi
**Base URL**: https://api.gan_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gan_ai](https://integrations.do/gan_ai)

## Installation

```bash
npm install @dotdo/integration-gan_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gan_ai
```

## Quick Start

```typescript
import { GanAiClient } from '@dotdo/integration-gan_ai'

// Initialize client
const client = new GanAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GanAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Gan ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GanAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GanAiError) {
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
