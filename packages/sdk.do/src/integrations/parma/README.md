# Parma Integration

Parma CRM is a relationship management app designed to help you accelerate growth by deepening and nurturing your business relationships.

**Category**: productivity
**Service**: Parma
**Base URL**: https://api.parma.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/parma](https://integrations.do/parma)

## Installation

```bash
npm install @dotdo/integration-parma
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-parma
```

## Quick Start

```typescript
import { ParmaClient } from '@dotdo/integration-parma'

// Initialize client
const client = new ParmaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ParmaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Parma actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ParmaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ParmaError) {
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
