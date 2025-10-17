# Endorsal Integration

Endorsal automates the collection and display of customer testimonials and reviews, enhancing social proof for businesses.

**Category**: productivity
**Service**: Endorsal
**Base URL**: https://api.endorsal.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/endorsal](https://integrations.do/endorsal)

## Installation

```bash
npm install @dotdo/integration-endorsal
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-endorsal
```

## Quick Start

```typescript
import { EndorsalClient } from '@dotdo/integration-endorsal'

// Initialize client
const client = new EndorsalClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EndorsalClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Endorsal actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EndorsalError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EndorsalError) {
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
