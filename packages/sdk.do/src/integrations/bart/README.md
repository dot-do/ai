# Bart Integration

BART (Bay Area Rapid Transit) provides public transportation services in the San Francisco Bay Area.

**Category**: productivity
**Service**: Bart
**Base URL**: https://api.bart.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bart](https://integrations.do/bart)

## Installation

```bash
npm install @dotdo/integration-bart
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bart
```

## Quick Start

```typescript
import { BartClient } from '@dotdo/integration-bart'

// Initialize client
const client = new BartClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BartClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bart actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BartError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BartError) {
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
