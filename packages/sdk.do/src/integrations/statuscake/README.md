# Statuscake Integration

StatusCake is a website monitoring platform that provides observability for applications, offering features like uptime monitoring, page speed monitoring, SSL monitoring, and more.

**Category**: productivity
**Service**: Statuscake
**Base URL**: https://api.statuscake.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/statuscake](https://integrations.do/statuscake)

## Installation

```bash
npm install @dotdo/integration-statuscake
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-statuscake
```

## Quick Start

```typescript
import { StatuscakeClient } from '@dotdo/integration-statuscake'

// Initialize client
const client = new StatuscakeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new StatuscakeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Statuscake actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `StatuscakeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof StatuscakeError) {
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
