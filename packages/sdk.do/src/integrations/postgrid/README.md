# Postgrid Integration

PostGrid provides APIs for automating direct mail and address verification services, enabling businesses to send letters, postcards, and checks, as well as verify and standardize addresses in real-time.

**Category**: productivity
**Service**: Postgrid
**Base URL**: https://api.postgrid.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/postgrid](https://integrations.do/postgrid)

## Installation

```bash
npm install @dotdo/integration-postgrid
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-postgrid
```

## Quick Start

```typescript
import { PostgridClient } from '@dotdo/integration-postgrid'

// Initialize client
const client = new PostgridClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PostgridClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Postgrid actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PostgridError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PostgridError) {
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
