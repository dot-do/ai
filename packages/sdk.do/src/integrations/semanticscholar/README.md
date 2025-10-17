# Semanticscholar Integration

Semantic Scholar is an AI-powered academic search engine that helps researchers discover and understand scientific literature

**Category**: developer-tools
**Service**: Semanticscholar
**Base URL**: https://api.semanticscholar.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/semanticscholar](https://integrations.do/semanticscholar)

## Installation

```bash
npm install @dotdo/integration-semanticscholar
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-semanticscholar
```

## Quick Start

```typescript
import { SemanticscholarClient } from '@dotdo/integration-semanticscholar'

// Initialize client
const client = new SemanticscholarClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SemanticscholarClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Semanticscholar actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SemanticscholarError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SemanticscholarError) {
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
