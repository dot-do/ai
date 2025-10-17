# Kickbox Integration

Kickbox provides an API for real-time email verification, list cleaning, and quality scoring to ensure email deliverability.

**Category**: productivity
**Service**: Kickbox
**Base URL**: https://api.kickbox.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/kickbox](https://integrations.do/kickbox)

## Installation

```bash
npm install @dotdo/integration-kickbox
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-kickbox
```

## Quick Start

```typescript
import { KickboxClient } from '@dotdo/integration-kickbox'

// Initialize client
const client = new KickboxClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new KickboxClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Kickbox actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KickboxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KickboxError) {
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
