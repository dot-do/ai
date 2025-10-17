# Proofly Integration

Proofly is a social proof toolkit that helps boost website conversions by displaying real-time notifications of customer activities.

**Category**: marketing
**Service**: Proofly
**Base URL**: https://api.proofly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/proofly](https://integrations.do/proofly)

## Installation

```bash
npm install @dotdo/integration-proofly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-proofly
```

## Quick Start

```typescript
import { ProoflyClient } from '@dotdo/integration-proofly'

// Initialize client
const client = new ProoflyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ProoflyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Proofly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ProoflyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ProoflyError) {
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
