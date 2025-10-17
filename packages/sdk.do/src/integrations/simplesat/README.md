# Simplesat Integration

Simplesat captures customer feedback and CSAT scores through surveys, integrating directly with helpdesk systems for real-time performance insights

**Category**: crm
**Service**: Simplesat
**Base URL**: https://api.simplesat.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/simplesat](https://integrations.do/simplesat)

## Installation

```bash
npm install @dotdo/integration-simplesat
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-simplesat
```

## Quick Start

```typescript
import { SimplesatClient } from '@dotdo/integration-simplesat'

// Initialize client
const client = new SimplesatClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SimplesatClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Simplesat actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SimplesatError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SimplesatError) {
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
