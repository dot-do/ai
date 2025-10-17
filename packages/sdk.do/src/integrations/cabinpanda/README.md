# Cabinpanda Integration

CabinPanda is a data collection platform that enables users to create and manage online forms, facilitating efficient data gathering and analysis.

**Category**: productivity
**Service**: Cabinpanda
**Base URL**: https://api.cabinpanda.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cabinpanda](https://integrations.do/cabinpanda)

## Installation

```bash
npm install @dotdo/integration-cabinpanda
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cabinpanda
```

## Quick Start

```typescript
import { CabinpandaClient } from '@dotdo/integration-cabinpanda'

// Initialize client
const client = new CabinpandaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CabinpandaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cabinpanda actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CabinpandaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CabinpandaError) {
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
