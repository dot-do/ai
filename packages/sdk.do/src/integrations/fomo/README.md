# Fomo Integration

Fomo is a social proof marketing platform that displays real-time user activity notifications on websites to build trust and increase conversions.

**Category**: marketing
**Service**: Fomo
**Base URL**: https://api.fomo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/fomo](https://integrations.do/fomo)

## Installation

```bash
npm install @dotdo/integration-fomo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-fomo
```

## Quick Start

```typescript
import { FomoClient } from '@dotdo/integration-fomo'

// Initialize client
const client = new FomoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FomoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Fomo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FomoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FomoError) {
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
