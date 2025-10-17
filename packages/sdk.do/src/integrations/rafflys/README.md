# Rafflys Integration

Rafflys hosts giveaways and contests, enabling brands to engage audiences, grow social reach, and reward participants with automated selection processes

**Category**: marketing
**Service**: Rafflys
**Base URL**: https://api.rafflys.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/rafflys](https://integrations.do/rafflys)

## Installation

```bash
npm install @dotdo/integration-rafflys
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-rafflys
```

## Quick Start

```typescript
import { RafflysClient } from '@dotdo/integration-rafflys'

// Initialize client
const client = new RafflysClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RafflysClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Rafflys actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RafflysError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RafflysError) {
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
