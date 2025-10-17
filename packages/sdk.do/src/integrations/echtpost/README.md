# Echtpost Integration

EchtPost facilitates secure digital communication, encryption, and data privacy, providing a reliable channel for sending confidential documents and messages

**Category**: communication
**Service**: Echtpost
**Base URL**: https://api.echtpost.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/echtpost](https://integrations.do/echtpost)

## Installation

```bash
npm install @dotdo/integration-echtpost
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-echtpost
```

## Quick Start

```typescript
import { EchtpostClient } from '@dotdo/integration-echtpost'

// Initialize client
const client = new EchtpostClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EchtpostClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Echtpost actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EchtpostError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EchtpostError) {
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
