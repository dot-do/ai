# Textrazor Integration

TextRazor is a natural language processing API that extracts meaning, entities, and relationships from text, powering advanced content analysis and sentiment detection

**Category**: developer-tools
**Service**: Textrazor
**Base URL**: https://api.textrazor.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/textrazor](https://integrations.do/textrazor)

## Installation

```bash
npm install @dotdo/integration-textrazor
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-textrazor
```

## Quick Start

```typescript
import { TextrazorClient } from '@dotdo/integration-textrazor'

// Initialize client
const client = new TextrazorClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TextrazorClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Textrazor actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TextrazorError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TextrazorError) {
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
