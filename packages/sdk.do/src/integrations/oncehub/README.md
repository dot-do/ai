# Oncehub Integration

OnceHub is a scheduling and appointment management software that automates meeting coordination, eliminating back-and-forth emails for booking

**Category**: productivity
**Service**: Oncehub
**Base URL**: https://api.oncehub.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/oncehub](https://integrations.do/oncehub)

## Installation

```bash
npm install @dotdo/integration-oncehub
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-oncehub
```

## Quick Start

```typescript
import { OncehubClient } from '@dotdo/integration-oncehub'

// Initialize client
const client = new OncehubClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OncehubClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Oncehub actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OncehubError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OncehubError) {
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
