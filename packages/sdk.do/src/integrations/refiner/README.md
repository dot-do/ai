# Refiner Integration

Refiner is a customer feedback and survey tool designed to help businesses collect and analyze user insights.

**Category**: productivity
**Service**: Refiner
**Base URL**: https://api.refiner.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/refiner](https://integrations.do/refiner)

## Installation

```bash
npm install @dotdo/integration-refiner
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-refiner
```

## Quick Start

```typescript
import { RefinerClient } from '@dotdo/integration-refiner'

// Initialize client
const client = new RefinerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RefinerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Refiner actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RefinerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RefinerError) {
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
