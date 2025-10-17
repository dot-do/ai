# Melo Integration

Melo provides a comprehensive API for accessing real-time, deduplicated real estate listings and market analytics across France.

**Category**: productivity
**Service**: Melo
**Base URL**: https://api.melo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/melo](https://integrations.do/melo)

## Installation

```bash
npm install @dotdo/integration-melo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-melo
```

## Quick Start

```typescript
import { MeloClient } from '@dotdo/integration-melo'

// Initialize client
const client = new MeloClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MeloClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Melo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MeloError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MeloError) {
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
