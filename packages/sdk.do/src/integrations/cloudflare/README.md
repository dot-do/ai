# Cloudflare Integration

Cloudflare is a global network designed to make everything you connect to the Internet secure, private, fast, and reliable.

**Category**: productivity
**Service**: Cloudflare
**Base URL**: https://api.cloudflare.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cloudflare](https://integrations.do/cloudflare)

## Installation

```bash
npm install @dotdo/integration-cloudflare
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cloudflare
```

## Quick Start

```typescript
import { CloudflareClient } from '@dotdo/integration-cloudflare'

// Initialize client
const client = new CloudflareClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CloudflareClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cloudflare actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CloudflareError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CloudflareError) {
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
