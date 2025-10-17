# Maintainx Integration

MaintainX is a cloud-based computerized maintenance management system (CMMS) that helps organizations centralize maintenance data, communication, and workflows.

**Category**: productivity
**Service**: Maintainx
**Base URL**: https://api.maintainx.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/maintainx](https://integrations.do/maintainx)

## Installation

```bash
npm install @dotdo/integration-maintainx
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-maintainx
```

## Quick Start

```typescript
import { MaintainxClient } from '@dotdo/integration-maintainx'

// Initialize client
const client = new MaintainxClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MaintainxClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Maintainx actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MaintainxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MaintainxError) {
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
