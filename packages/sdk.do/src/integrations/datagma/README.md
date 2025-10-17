# Datagma Integration

Datagma delivers data intelligence and analytics, assisting companies in discovering market insights, tracking competitive metrics, and strategizing growth opportunities

**Category**: analytics
**Service**: Datagma
**Base URL**: https://api.datagma.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/datagma](https://integrations.do/datagma)

## Installation

```bash
npm install @dotdo/integration-datagma
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-datagma
```

## Quick Start

```typescript
import { DatagmaClient } from '@dotdo/integration-datagma'

// Initialize client
const client = new DatagmaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DatagmaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Datagma actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DatagmaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DatagmaError) {
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
