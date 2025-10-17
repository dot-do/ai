# Plisio Integration

Plisio is a cryptocurrency payment gateway that enables businesses to accept payments in over 15 cryptocurrencies, including Bitcoin, Ethereum, and Litecoin.

**Category**: productivity
**Service**: Plisio
**Base URL**: https://api.plisio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/plisio](https://integrations.do/plisio)

## Installation

```bash
npm install @dotdo/integration-plisio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-plisio
```

## Quick Start

```typescript
import { PlisioClient } from '@dotdo/integration-plisio'

// Initialize client
const client = new PlisioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PlisioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Plisio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PlisioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PlisioError) {
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
