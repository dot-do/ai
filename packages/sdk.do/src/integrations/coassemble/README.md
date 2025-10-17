# Coassemble Integration

Coassemble is a platform that allows users to create, manage, and deliver online training courses.

**Category**: productivity
**Service**: Coassemble
**Base URL**: https://api.coassemble.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/coassemble](https://integrations.do/coassemble)

## Installation

```bash
npm install @dotdo/integration-coassemble
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-coassemble
```

## Quick Start

```typescript
import { CoassembleClient } from '@dotdo/integration-coassemble'

// Initialize client
const client = new CoassembleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CoassembleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Coassemble actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CoassembleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CoassembleError) {
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
