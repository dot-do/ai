# Tisane Integration

Tisane API is a natural language processing tool that detects problematic content, extracts topics, and performs aspect-based sentiment analysis across 27 languages.

**Category**: productivity
**Service**: Tisane
**Base URL**: https://api.tisane.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tisane](https://integrations.do/tisane)

## Installation

```bash
npm install @dotdo/integration-tisane
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tisane
```

## Quick Start

```typescript
import { TisaneClient } from '@dotdo/integration-tisane'

// Initialize client
const client = new TisaneClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TisaneClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Tisane actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TisaneError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TisaneError) {
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
