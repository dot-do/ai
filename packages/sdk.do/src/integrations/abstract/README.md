# Abstract Integration

Abstract API provides a suite of APIs for developers to automate various tasks, including data validation, enrichment, and more.

**Category**: productivity
**Service**: Abstract
**Base URL**: https://api.abstract.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/abstract](https://integrations.do/abstract)

## Installation

```bash
npm install @dotdo/integration-abstract
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-abstract
```

## Quick Start

```typescript
import { AbstractClient } from '@dotdo/integration-abstract'

// Initialize client
const client = new AbstractClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AbstractClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Abstract actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AbstractError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AbstractError) {
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
