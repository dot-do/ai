# Brandfetch Integration

Brandfetch offers an API that retrieves company logos, brand colors, and other visual assets, helping marketers and developers maintain consistent branding across apps

**Category**: marketing
**Service**: Brandfetch
**Base URL**: https://api.brandfetch.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/brandfetch](https://integrations.do/brandfetch)

## Installation

```bash
npm install @dotdo/integration-brandfetch
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-brandfetch
```

## Quick Start

```typescript
import { BrandfetchClient } from '@dotdo/integration-brandfetch'

// Initialize client
const client = new BrandfetchClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BrandfetchClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Brandfetch actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrandfetchError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrandfetchError) {
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
