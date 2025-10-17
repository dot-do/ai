# Cardly Integration

Cardly helps businesses create great engagement with customers by getting out of inboxes and into mailboxes.

**Category**: productivity
**Service**: Cardly
**Base URL**: https://api.cardly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cardly](https://integrations.do/cardly)

## Installation

```bash
npm install @dotdo/integration-cardly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cardly
```

## Quick Start

```typescript
import { CardlyClient } from '@dotdo/integration-cardly'

// Initialize client
const client = new CardlyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CardlyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cardly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CardlyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CardlyError) {
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
