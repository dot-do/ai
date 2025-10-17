# Bugbug Integration

Bugbug is a platform for testing and monitoring your code.

**Category**: productivity
**Service**: Bugbug
**Base URL**: https://api.bugbug.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bugbug](https://integrations.do/bugbug)

## Installation

```bash
npm install @dotdo/integration-bugbug
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bugbug
```

## Quick Start

```typescript
import { BugbugClient } from '@dotdo/integration-bugbug'

// Initialize client
const client = new BugbugClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BugbugClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bugbug actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BugbugError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BugbugError) {
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
