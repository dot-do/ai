# Factorial Integration

Factorial streamlines HR management, from employee onboarding and time-off requests to payroll and performance evaluations, aimed at small and mid-sized companies

**Category**: hr
**Service**: Factorial
**Base URL**: https://api.factorial.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/factorial](https://integrations.do/factorial)

## Installation

```bash
npm install @dotdo/integration-factorial
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-factorial
```

## Quick Start

```typescript
import { FactorialClient } from '@dotdo/integration-factorial'

// Initialize client
const client = new FactorialClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FactorialClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Factorial actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FactorialError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FactorialError) {
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
