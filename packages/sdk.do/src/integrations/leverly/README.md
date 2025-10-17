# Leverly Integration

Leverly is a platform that integrates with various applications to automate workflows and processes.

**Category**: productivity
**Service**: Leverly
**Base URL**: https://api.leverly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/leverly](https://integrations.do/leverly)

## Installation

```bash
npm install @dotdo/integration-leverly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-leverly
```

## Quick Start

```typescript
import { LeverlyClient } from '@dotdo/integration-leverly'

// Initialize client
const client = new LeverlyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LeverlyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Leverly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LeverlyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LeverlyError) {
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
