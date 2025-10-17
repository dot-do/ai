# Perplexityai Integration

Perplexity AI provides conversational AI models for generating human-like text responses

**Category**: developer-tools
**Service**: Perplexityai
**Base URL**: https://api.perplexityai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/perplexityai](https://integrations.do/perplexityai)

## Installation

```bash
npm install @dotdo/integration-perplexityai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-perplexityai
```

## Quick Start

```typescript
import { PerplexityaiClient } from '@dotdo/integration-perplexityai'

// Initialize client
const client = new PerplexityaiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PerplexityaiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Perplexityai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PerplexityaiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PerplexityaiError) {
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
