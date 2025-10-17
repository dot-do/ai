# Openperplex Integration

Openperplex API provides powerful, global search capabilities and web content analysis for AI applications.

**Category**: productivity
**Service**: Openperplex
**Base URL**: https://api.openperplex.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/openperplex](https://integrations.do/openperplex)

## Installation

```bash
npm install @dotdo/integration-openperplex
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-openperplex
```

## Quick Start

```typescript
import { OpenperplexClient } from '@dotdo/integration-openperplex'

// Initialize client
const client = new OpenperplexClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OpenperplexClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Openperplex actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OpenperplexError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OpenperplexError) {
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
