# Whautomate Integration

Whautomate is a platform that offers seamless integrations for customer engagement, including AI chatbots, appointment scheduling, and broadcast messaging.

**Category**: productivity
**Service**: Whautomate
**Base URL**: https://api.whautomate.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/whautomate](https://integrations.do/whautomate)

## Installation

```bash
npm install @dotdo/integration-whautomate
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-whautomate
```

## Quick Start

```typescript
import { WhautomateClient } from '@dotdo/integration-whautomate'

// Initialize client
const client = new WhautomateClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WhautomateClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Whautomate actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WhautomateError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WhautomateError) {
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
