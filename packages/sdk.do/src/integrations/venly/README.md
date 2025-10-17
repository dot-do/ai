# Venly Integration

Venly provides blockchain tools, wallets, and NFT services, enabling businesses to integrate decentralized technology into apps without complex blockchain development

**Category**: productivity
**Service**: Venly
**Base URL**: https://api.venly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/venly](https://integrations.do/venly)

## Installation

```bash
npm install @dotdo/integration-venly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-venly
```

## Quick Start

```typescript
import { VenlyClient } from '@dotdo/integration-venly'

// Initialize client
const client = new VenlyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new VenlyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Venly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `VenlyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof VenlyError) {
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
