# Blocknative Integration

Blocknative provides real-time mempool monitoring and transaction management tools for public blockchains.

**Category**: productivity
**Service**: Blocknative
**Base URL**: https://api.blocknative.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/blocknative](https://integrations.do/blocknative)

## Installation

```bash
npm install @dotdo/integration-blocknative
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-blocknative
```

## Quick Start

```typescript
import { BlocknativeClient } from '@dotdo/integration-blocknative'

// Initialize client
const client = new BlocknativeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BlocknativeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Blocknative actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BlocknativeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BlocknativeError) {
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
