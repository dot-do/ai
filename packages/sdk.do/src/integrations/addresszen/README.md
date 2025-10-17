# Addresszen Integration

AddressZen provides address autocomplete and verification services, offering real-time address suggestions and validation to ensure accurate and deliverable addresses.

**Category**: productivity
**Service**: Addresszen
**Base URL**: https://api.addresszen.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/addresszen](https://integrations.do/addresszen)

## Installation

```bash
npm install @dotdo/integration-addresszen
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-addresszen
```

## Quick Start

```typescript
import { AddresszenClient } from '@dotdo/integration-addresszen'

// Initialize client
const client = new AddresszenClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AddresszenClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Addresszen actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AddresszenError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AddresszenError) {
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
