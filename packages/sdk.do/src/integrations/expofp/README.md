# Expofp Integration

ExpoFP provides free interactive floor plan software for expos and conferences.

**Category**: productivity
**Service**: Expofp
**Base URL**: https://api.expofp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/expofp](https://integrations.do/expofp)

## Installation

```bash
npm install @dotdo/integration-expofp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-expofp
```

## Quick Start

```typescript
import { ExpofpClient } from '@dotdo/integration-expofp'

// Initialize client
const client = new ExpofpClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ExpofpClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Expofp actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ExpofpError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ExpofpError) {
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
