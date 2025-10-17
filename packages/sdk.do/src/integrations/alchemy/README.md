# Alchemy Integration

Alchemy is a blockchain development platform that provides powerful APIs and developer tools for building and scaling Ethereum applications

**Category**: productivity
**Service**: Alchemy
**Base URL**: https://api.alchemy.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/alchemy](https://integrations.do/alchemy)

## Installation

```bash
npm install @dotdo/integration-alchemy
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-alchemy
```

## Quick Start

```typescript
import { AlchemyClient } from '@dotdo/integration-alchemy'

// Initialize client
const client = new AlchemyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AlchemyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Alchemy actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AlchemyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AlchemyError) {
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
