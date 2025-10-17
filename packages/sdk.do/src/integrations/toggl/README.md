# Toggl Integration

Toggl is a time tracking application that helps users monitor and manage their work hours efficiently.

**Category**: productivity
**Service**: Toggl
**Base URL**: https://api.toggl.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/toggl](https://integrations.do/toggl)

## Installation

```bash
npm install @dotdo/integration-toggl
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-toggl
```

## Quick Start

```typescript
import { TogglClient } from '@dotdo/integration-toggl'

// Initialize client
const client = new TogglClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TogglClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Toggl actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TogglError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TogglError) {
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
