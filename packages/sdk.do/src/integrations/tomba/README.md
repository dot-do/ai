# Tomba Integration

Tomba is an Email Finder for B2B sales and email marketing.

**Category**: productivity
**Service**: Tomba
**Base URL**: https://api.tomba.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tomba](https://integrations.do/tomba)

## Installation

```bash
npm install @dotdo/integration-tomba
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tomba
```

## Quick Start

```typescript
import { TombaClient } from '@dotdo/integration-tomba'

// Initialize client
const client = new TombaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TombaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Tomba actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TombaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TombaError) {
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
