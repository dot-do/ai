# Skyfire Integration

Skyfire enables AI agents to autonomously transact and pay for services, creating a seamless payment infrastructure for AI applications.

**Category**: productivity
**Service**: Skyfire
**Base URL**: https://api.skyfire.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/skyfire](https://integrations.do/skyfire)

## Installation

```bash
npm install @dotdo/integration-skyfire
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-skyfire
```

## Quick Start

```typescript
import { SkyfireClient } from '@dotdo/integration-skyfire'

// Initialize client
const client = new SkyfireClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SkyfireClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Skyfire actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SkyfireError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SkyfireError) {
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
