# Zeplin Integration

Template description for zeplin

**Category**: productivity
**Service**: Zeplin
**Base URL**: https://api.zeplin.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zeplin](https://integrations.do/zeplin)

## Installation

```bash
npm install @dotdo/integration-zeplin
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zeplin
```

## Quick Start

```typescript
import { ZeplinClient } from '@dotdo/integration-zeplin'

// Initialize client
const client = new ZeplinClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ZeplinClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Zeplin actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZeplinError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZeplinError) {
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
