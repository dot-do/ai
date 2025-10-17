# Felt Integration

Felt is a modern GIS platform that allows users to create, modify, and share interactive maps, integrating powerful mapping capabilities into various workflows and applications.

**Category**: productivity
**Service**: Felt
**Base URL**: https://api.felt.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/felt](https://integrations.do/felt)

## Installation

```bash
npm install @dotdo/integration-felt
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-felt
```

## Quick Start

```typescript
import { FeltClient } from '@dotdo/integration-felt'

// Initialize client
const client = new FeltClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FeltClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Felt actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FeltError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FeltError) {
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
