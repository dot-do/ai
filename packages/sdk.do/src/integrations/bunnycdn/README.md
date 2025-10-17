# Bunnycdn Integration

BunnyCDN is a powerful content delivery network (CDN) offering an API to manage and deliver content globally with ease.

**Category**: productivity
**Service**: Bunnycdn
**Base URL**: https://api.bunnycdn.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bunnycdn](https://integrations.do/bunnycdn)

## Installation

```bash
npm install @dotdo/integration-bunnycdn
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bunnycdn
```

## Quick Start

```typescript
import { BunnycdnClient } from '@dotdo/integration-bunnycdn'

// Initialize client
const client = new BunnycdnClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BunnycdnClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bunnycdn actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BunnycdnError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BunnycdnError) {
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
