# Passslot Integration

PassSlot is a service that simplifies the creation, design, and distribution of Apple Wallet passes, including coupons, store cards, event tickets, membership cards, and boarding passes.

**Category**: productivity
**Service**: Passslot
**Base URL**: https://api.passslot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/passslot](https://integrations.do/passslot)

## Installation

```bash
npm install @dotdo/integration-passslot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-passslot
```

## Quick Start

```typescript
import { PassslotClient } from '@dotdo/integration-passslot'

// Initialize client
const client = new PassslotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PassslotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Passslot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PassslotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PassslotError) {
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
