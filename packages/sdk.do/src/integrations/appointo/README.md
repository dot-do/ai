# Appointo Integration

Appointo is an appointment booking application designed for Shopify stores, enabling businesses to integrate online booking systems seamlessly into their websites without any coding required.

**Category**: productivity
**Service**: Appointo
**Base URL**: https://api.appointo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/appointo](https://integrations.do/appointo)

## Installation

```bash
npm install @dotdo/integration-appointo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-appointo
```

## Quick Start

```typescript
import { AppointoClient } from '@dotdo/integration-appointo'

// Initialize client
const client = new AppointoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AppointoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Appointo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AppointoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AppointoError) {
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
