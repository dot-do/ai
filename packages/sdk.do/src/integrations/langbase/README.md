# Langbase Integration

Langbase is a serverless AI developer platform that enables developers to build, collaborate, and deploy AI agents and applications with composable AI infrastructure.

**Category**: productivity
**Service**: Langbase
**Base URL**: https://api.langbase.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/langbase](https://integrations.do/langbase)

## Installation

```bash
npm install @dotdo/integration-langbase
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-langbase
```

## Quick Start

```typescript
import { LangbaseClient } from '@dotdo/integration-langbase'

// Initialize client
const client = new LangbaseClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LangbaseClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Langbase actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LangbaseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LangbaseError) {
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
