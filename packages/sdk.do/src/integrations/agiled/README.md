# Agiled Integration

Agiled is an all-in-one business management platform designed to streamline operations such as CRM, project management, finance, and more.

**Category**: productivity
**Service**: Agiled
**Base URL**: https://api.agiled.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/agiled](https://integrations.do/agiled)

## Installation

```bash
npm install @dotdo/integration-agiled
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-agiled
```

## Quick Start

```typescript
import { AgiledClient } from '@dotdo/integration-agiled'

// Initialize client
const client = new AgiledClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AgiledClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Agiled actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AgiledError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AgiledError) {
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
