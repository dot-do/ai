# Realphonevalidation Integration

RealPhoneValidation offers real-time phone number validation services, providing information on connectivity, phone type, carrier, and more.

**Category**: productivity
**Service**: Realphonevalidation
**Base URL**: https://api.realphonevalidation.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/realphonevalidation](https://integrations.do/realphonevalidation)

## Installation

```bash
npm install @dotdo/integration-realphonevalidation
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-realphonevalidation
```

## Quick Start

```typescript
import { RealphonevalidationClient } from '@dotdo/integration-realphonevalidation'

// Initialize client
const client = new RealphonevalidationClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RealphonevalidationClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Realphonevalidation actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RealphonevalidationError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RealphonevalidationError) {
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
