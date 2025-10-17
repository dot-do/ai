# Fireberry Integration

Fireberry is a CRM platform that offers integrations with various tools and applications to streamline business processes.

**Category**: crm
**Service**: Fireberry
**Base URL**: https://api.fireberry.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/fireberry](https://integrations.do/fireberry)

## Installation

```bash
npm install @dotdo/integration-fireberry
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-fireberry
```

## Quick Start

```typescript
import { FireberryClient } from '@dotdo/integration-fireberry'

// Initialize client
const client = new FireberryClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FireberryClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Fireberry actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FireberryError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FireberryError) {
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
