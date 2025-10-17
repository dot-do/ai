# Bench Integration

Benchmarking tool

**Category**: productivity
**Service**: Bench
**Base URL**: https://api.bench.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bench](https://integrations.do/bench)

## Installation

```bash
npm install @dotdo/integration-bench
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bench
```

## Quick Start

```typescript
import { BenchClient } from '@dotdo/integration-bench'

// Initialize client
const client = new BenchClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BenchClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bench actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BenchError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BenchError) {
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
