# Textcortex Integration

TextCortex offers an AI-powered text generation API that enables developers to integrate advanced language models into their applications for tasks such as content creation, paraphrasing, and more.

**Category**: productivity
**Service**: Textcortex
**Base URL**: https://api.textcortex.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/textcortex](https://integrations.do/textcortex)

## Installation

```bash
npm install @dotdo/integration-textcortex
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-textcortex
```

## Quick Start

```typescript
import { TextcortexClient } from '@dotdo/integration-textcortex'

// Initialize client
const client = new TextcortexClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TextcortexClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Textcortex actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TextcortexError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TextcortexError) {
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
