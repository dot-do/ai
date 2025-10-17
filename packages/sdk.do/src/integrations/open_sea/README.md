# Open sea Integration

OpenSea is the world's first and largest NFT marketplace for NFTs and crypto collectibles.

**Category**: productivity
**Service**: OpenSea
**Base URL**: https://api.open_sea.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/open_sea](https://integrations.do/open_sea)

## Installation

```bash
npm install @dotdo/integration-open_sea
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-open_sea
```

## Quick Start

```typescript
import { OpenSeaClient } from '@dotdo/integration-open_sea'

// Initialize client
const client = new OpenSeaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OpenSeaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Open sea actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OpenSeaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OpenSeaError) {
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
