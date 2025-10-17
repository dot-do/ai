# Worksnaps Integration

Worksnaps is a time-tracking service designed for remote work that offers detailed project and user activity insights.

**Category**: productivity
**Service**: Worksnaps
**Base URL**: https://api.worksnaps.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/worksnaps](https://integrations.do/worksnaps)

## Installation

```bash
npm install @dotdo/integration-worksnaps
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-worksnaps
```

## Quick Start

```typescript
import { WorksnapsClient } from '@dotdo/integration-worksnaps'

// Initialize client
const client = new WorksnapsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WorksnapsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Worksnaps actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WorksnapsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WorksnapsError) {
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
