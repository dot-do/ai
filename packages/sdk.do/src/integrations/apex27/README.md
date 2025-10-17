# Apex27 Integration

Apex 27 is a comprehensive estate agency software platform designed for real estate professionals, offering tools for property listings, client management, and office administration.

**Category**: productivity
**Service**: Apex27
**Base URL**: https://api.apex27.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apex27](https://integrations.do/apex27)

## Installation

```bash
npm install @dotdo/integration-apex27
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apex27
```

## Quick Start

```typescript
import { Apex27Client } from '@dotdo/integration-apex27'

// Initialize client
const client = new Apex27Client({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Apex27Client({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Apex27 actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Apex27Error` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Apex27Error) {
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
