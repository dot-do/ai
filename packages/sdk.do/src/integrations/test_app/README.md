# Test app Integration

...

**Category**: productivity
**Service**: TestApp
**Base URL**: https://api.test_app.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/test_app](https://integrations.do/test_app)

## Installation

```bash
npm install @dotdo/integration-test_app
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-test_app
```

## Quick Start

```typescript
import { TestAppClient } from '@dotdo/integration-test_app'

// Initialize client
const client = new TestAppClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TestAppClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Test app actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TestAppError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TestAppError) {
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
