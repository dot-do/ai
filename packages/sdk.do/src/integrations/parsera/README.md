# Parsera Integration

Parsera is a lightweight Python library for scraping websites using large language models (LLMs).

**Category**: productivity
**Service**: Parsera
**Base URL**: https://api.parsera.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/parsera](https://integrations.do/parsera)

## Installation

```bash
npm install @dotdo/integration-parsera
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-parsera
```

## Quick Start

```typescript
import { ParseraClient } from '@dotdo/integration-parsera'

// Initialize client
const client = new ParseraClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ParseraClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Parsera actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ParseraError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ParseraError) {
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
