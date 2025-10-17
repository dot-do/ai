# Hashnode Integration

Hashnode is a blogging platform tailored for developers, offering tools to create, manage, and publish content seamlessly.

**Category**: productivity
**Service**: Hashnode
**Base URL**: https://api.hashnode.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/hashnode](https://integrations.do/hashnode)

## Installation

```bash
npm install @dotdo/integration-hashnode
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-hashnode
```

## Quick Start

```typescript
import { HashnodeClient } from '@dotdo/integration-hashnode'

// Initialize client
const client = new HashnodeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HashnodeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Hashnode actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HashnodeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HashnodeError) {
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
