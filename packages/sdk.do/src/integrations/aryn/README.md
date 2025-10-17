# Aryn Integration

Aryn is an AI-powered platform for document parsing, data extraction, and analytics, enabling users to process and query unstructured documents at scale.

**Category**: productivity
**Service**: Aryn
**Base URL**: https://api.aryn.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/aryn](https://integrations.do/aryn)

## Installation

```bash
npm install @dotdo/integration-aryn
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-aryn
```

## Quick Start

```typescript
import { ArynClient } from '@dotdo/integration-aryn'

// Initialize client
const client = new ArynClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ArynClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Aryn actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ArynError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ArynError) {
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
