# Mezmo Integration

Mezmo provides a comprehensive platform for log management and telemetry data processing, enabling organizations to collect, analyze, and manage their log data efficiently.

**Category**: productivity
**Service**: Mezmo
**Base URL**: https://api.mezmo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mezmo](https://integrations.do/mezmo)

## Installation

```bash
npm install @dotdo/integration-mezmo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mezmo
```

## Quick Start

```typescript
import { MezmoClient } from '@dotdo/integration-mezmo'

// Initialize client
const client = new MezmoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MezmoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mezmo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MezmoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MezmoError) {
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
