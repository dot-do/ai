# Bugsnag Integration

Bugsnag is an error monitoring and stability management platform that helps developers identify, prioritize, and fix software bugs.

**Category**: productivity
**Service**: Bugsnag
**Base URL**: https://api.bugsnag.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bugsnag](https://integrations.do/bugsnag)

## Installation

```bash
npm install @dotdo/integration-bugsnag
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bugsnag
```

## Quick Start

```typescript
import { BugsnagClient } from '@dotdo/integration-bugsnag'

// Initialize client
const client = new BugsnagClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BugsnagClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bugsnag actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BugsnagError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BugsnagError) {
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
