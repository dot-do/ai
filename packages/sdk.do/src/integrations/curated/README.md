# Curated Integration

Curated is a platform that enables users to collect, curate, and publish newsletters, integrating with various services through its API.

**Category**: productivity
**Service**: Curated
**Base URL**: https://api.curated.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/curated](https://integrations.do/curated)

## Installation

```bash
npm install @dotdo/integration-curated
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-curated
```

## Quick Start

```typescript
import { CuratedClient } from '@dotdo/integration-curated'

// Initialize client
const client = new CuratedClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CuratedClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Curated actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CuratedError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CuratedError) {
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
