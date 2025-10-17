# Astica ai Integration

astica ai offers a suite of cognitive intelligence APIs, including computer vision, natural language processing, and voice synthesis, enabling developers to integrate advanced AI capabilities into their applications.

**Category**: productivity
**Service**: AsticaAi
**Base URL**: https://api.astica_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/astica_ai](https://integrations.do/astica_ai)

## Installation

```bash
npm install @dotdo/integration-astica_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-astica_ai
```

## Quick Start

```typescript
import { AsticaAiClient } from '@dotdo/integration-astica_ai'

// Initialize client
const client = new AsticaAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AsticaAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Astica ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AsticaAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AsticaAiError) {
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
