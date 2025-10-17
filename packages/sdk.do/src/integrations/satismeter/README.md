# Satismeter Integration

SatisMeter is a customer feedback platform that enables businesses to collect and analyze user feedback through targeted surveys.

**Category**: productivity
**Service**: Satismeter
**Base URL**: https://api.satismeter.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/satismeter](https://integrations.do/satismeter)

## Installation

```bash
npm install @dotdo/integration-satismeter
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-satismeter
```

## Quick Start

```typescript
import { SatismeterClient } from '@dotdo/integration-satismeter'

// Initialize client
const client = new SatismeterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SatismeterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Satismeter actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SatismeterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SatismeterError) {
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
