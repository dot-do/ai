# Metatextai Integration

Metatext AI specializes in natural language processing and text generation, helping organizations automate writing tasks, sentiment analysis, or content moderation

**Category**: developer-tools
**Service**: Metatextai
**Base URL**: https://api.metatextai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/metatextai](https://integrations.do/metatextai)

## Installation

```bash
npm install @dotdo/integration-metatextai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-metatextai
```

## Quick Start

```typescript
import { MetatextaiClient } from '@dotdo/integration-metatextai'

// Initialize client
const client = new MetatextaiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MetatextaiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Metatextai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MetatextaiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MetatextaiError) {
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
