# Affinity Integration

Affinity helps private capital investors to find, manage, and close more deals

**Category**: crm
**Service**: Affinity
**Base URL**: https://api.affinity.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/affinity](https://integrations.do/affinity)

## Installation

```bash
npm install @dotdo/integration-affinity
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-affinity
```

## Quick Start

```typescript
import { AffinityClient } from '@dotdo/integration-affinity'

// Initialize client
const client = new AffinityClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AffinityClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Affinity actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AffinityError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AffinityError) {
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
