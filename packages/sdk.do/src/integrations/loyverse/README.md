# Loyverse Integration

Loyverse is a point-of-sale (POS) system designed for small businesses, offering features like sales management, inventory tracking, and customer engagement tools.

**Category**: productivity
**Service**: Loyverse
**Base URL**: https://api.loyverse.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/loyverse](https://integrations.do/loyverse)

## Installation

```bash
npm install @dotdo/integration-loyverse
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-loyverse
```

## Quick Start

```typescript
import { LoyverseClient } from '@dotdo/integration-loyverse'

// Initialize client
const client = new LoyverseClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LoyverseClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Loyverse actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LoyverseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LoyverseError) {
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
