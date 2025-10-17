# Spondyr Integration

Template description for spondyr

**Category**: productivity
**Service**: Spondyr
**Base URL**: https://api.spondyr.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/spondyr](https://integrations.do/spondyr)

## Installation

```bash
npm install @dotdo/integration-spondyr
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-spondyr
```

## Quick Start

```typescript
import { SpondyrClient } from '@dotdo/integration-spondyr'

// Initialize client
const client = new SpondyrClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SpondyrClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Spondyr actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SpondyrError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SpondyrError) {
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
