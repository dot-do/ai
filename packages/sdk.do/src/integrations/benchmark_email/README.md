# Benchmark email Integration

Benchmark Email is a comprehensive email marketing platform offering tools for creating, sending, and analyzing email campaigns.

**Category**: productivity
**Service**: BenchmarkEmail
**Base URL**: https://api.benchmark_email.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/benchmark_email](https://integrations.do/benchmark_email)

## Installation

```bash
npm install @dotdo/integration-benchmark_email
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-benchmark_email
```

## Quick Start

```typescript
import { BenchmarkEmailClient } from '@dotdo/integration-benchmark_email'

// Initialize client
const client = new BenchmarkEmailClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BenchmarkEmailClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Benchmark email actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BenchmarkEmailError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BenchmarkEmailError) {
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
