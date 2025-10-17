# Neon Integration

Postgres, on a serverless platform designed to help you build reliable and scalable applications faster

**Category**: developer-tools
**Service**: Neon
**Base URL**: https://api.neon.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/neon](https://integrations.do/neon)

## Installation

```bash
npm install @dotdo/integration-neon
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-neon
```

## Quick Start

```typescript
import { NeonClient } from '@dotdo/integration-neon'

// Initialize client
const client = new NeonClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NeonClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Neon actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NeonError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NeonError) {
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
