# Bolna Integration

Create conversational voice agents using Bolna AI to enhance interactions, streamline operations and automate support.

**Category**: productivity
**Service**: Bolna
**Base URL**: https://api.bolna.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bolna](https://integrations.do/bolna)

## Installation

```bash
npm install @dotdo/integration-bolna
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bolna
```

## Quick Start

```typescript
import { BolnaClient } from '@dotdo/integration-bolna'

// Initialize client
const client = new BolnaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BolnaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bolna actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BolnaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BolnaError) {
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
