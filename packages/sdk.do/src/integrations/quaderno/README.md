# Quaderno Integration

Quaderno is a tax compliance platform that automates tax calculations, invoicing, and reporting for businesses worldwide.

**Category**: productivity
**Service**: Quaderno
**Base URL**: https://api.quaderno.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/quaderno](https://integrations.do/quaderno)

## Installation

```bash
npm install @dotdo/integration-quaderno
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-quaderno
```

## Quick Start

```typescript
import { QuadernoClient } from '@dotdo/integration-quaderno'

// Initialize client
const client = new QuadernoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new QuadernoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Quaderno actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `QuadernoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof QuadernoError) {
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
