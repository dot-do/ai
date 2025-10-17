# Interzoid Integration

Interzoid offers APIs for data matching, verification, and enrichment, allowing developers to improve data quality and integrate real-time insights into applications

**Category**: analytics
**Service**: Interzoid
**Base URL**: https://api.interzoid.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/interzoid](https://integrations.do/interzoid)

## Installation

```bash
npm install @dotdo/integration-interzoid
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-interzoid
```

## Quick Start

```typescript
import { InterzoidClient } from '@dotdo/integration-interzoid'

// Initialize client
const client = new InterzoidClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new InterzoidClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Interzoid actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `InterzoidError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof InterzoidError) {
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
