# Gleap Integration

Gleap is an all-in-one customer feedback tool for apps and websites, enabling direct communication with users to build better software by discovering their everyday pain points.

**Category**: productivity
**Service**: Gleap
**Base URL**: https://api.gleap.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gleap](https://integrations.do/gleap)

## Installation

```bash
npm install @dotdo/integration-gleap
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gleap
```

## Quick Start

```typescript
import { GleapClient } from '@dotdo/integration-gleap'

// Initialize client
const client = new GleapClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GleapClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Gleap actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GleapError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GleapError) {
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
