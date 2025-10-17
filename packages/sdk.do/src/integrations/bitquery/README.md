# Bitquery Integration

Bitquery provides historical and real-time indexed data for over 40 blockchains through GraphQL APIs, Websockets, SQL, and cloud providers.

**Category**: productivity
**Service**: Bitquery
**Base URL**: https://api.bitquery.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bitquery](https://integrations.do/bitquery)

## Installation

```bash
npm install @dotdo/integration-bitquery
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bitquery
```

## Quick Start

```typescript
import { BitqueryClient } from '@dotdo/integration-bitquery'

// Initialize client
const client = new BitqueryClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BitqueryClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bitquery actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BitqueryError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BitqueryError) {
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
