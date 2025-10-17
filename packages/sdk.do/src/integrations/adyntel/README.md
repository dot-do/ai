# Adyntel Integration

Adyntel provides an API to retrieve LinkedIn ads for a given company by inputting the company's domain or LinkedIn Page ID.

**Category**: productivity
**Service**: Adyntel
**Base URL**: https://api.adyntel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/adyntel](https://integrations.do/adyntel)

## Installation

```bash
npm install @dotdo/integration-adyntel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-adyntel
```

## Quick Start

```typescript
import { AdyntelClient } from '@dotdo/integration-adyntel'

// Initialize client
const client = new AdyntelClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AdyntelClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Adyntel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AdyntelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AdyntelError) {
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
