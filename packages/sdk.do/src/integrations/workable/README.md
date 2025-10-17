# Workable Integration

Workable is an all-in-one HR software platform that streamlines hiring, employee data management, time tracking, and payroll.

**Category**: productivity
**Service**: Workable
**Base URL**: https://api.workable.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/workable](https://integrations.do/workable)

## Installation

```bash
npm install @dotdo/integration-workable
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-workable
```

## Quick Start

```typescript
import { WorkableClient } from '@dotdo/integration-workable'

// Initialize client
const client = new WorkableClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WorkableClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Workable actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WorkableError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WorkableError) {
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
