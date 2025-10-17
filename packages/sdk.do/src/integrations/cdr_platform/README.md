# Cdr platform Integration

CDR Platform provides an API for purchasing carbon dioxide removal services.

**Category**: productivity
**Service**: CdrPlatform
**Base URL**: https://api.cdr_platform.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cdr_platform](https://integrations.do/cdr_platform)

## Installation

```bash
npm install @dotdo/integration-cdr_platform
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cdr_platform
```

## Quick Start

```typescript
import { CdrPlatformClient } from '@dotdo/integration-cdr_platform'

// Initialize client
const client = new CdrPlatformClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CdrPlatformClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cdr platform actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CdrPlatformError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CdrPlatformError) {
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
