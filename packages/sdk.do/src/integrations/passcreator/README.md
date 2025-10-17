# Passcreator Integration

Passcreator is a SaaS platform that enables businesses to create, distribute, and manage digital Wallet passes for Apple Wallet and Google Wallet, including store cards, event tickets, coupons, and membership cards.

**Category**: productivity
**Service**: Passcreator
**Base URL**: https://api.passcreator.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/passcreator](https://integrations.do/passcreator)

## Installation

```bash
npm install @dotdo/integration-passcreator
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-passcreator
```

## Quick Start

```typescript
import { PasscreatorClient } from '@dotdo/integration-passcreator'

// Initialize client
const client = new PasscreatorClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PasscreatorClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Passcreator actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PasscreatorError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PasscreatorError) {
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
