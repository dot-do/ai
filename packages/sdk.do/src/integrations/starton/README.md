# Starton Integration

Starton is an all-in-one Web3 API platform that enables developers to deploy and interact with smart contracts, store files on IPFS, and monitor blockchain events through a unified API and frontend interface.

**Category**: productivity
**Service**: Starton
**Base URL**: https://api.starton.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/starton](https://integrations.do/starton)

## Installation

```bash
npm install @dotdo/integration-starton
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-starton
```

## Quick Start

```typescript
import { StartonClient } from '@dotdo/integration-starton'

// Initialize client
const client = new StartonClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new StartonClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Starton actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `StartonError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof StartonError) {
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
