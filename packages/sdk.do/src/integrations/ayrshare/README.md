# Ayrshare Integration

Ayrshare provides a Social Media API that enables developers to programmatically manage and automate social media posts, analytics, and interactions across multiple platforms.

**Category**: productivity
**Service**: Ayrshare
**Base URL**: https://api.ayrshare.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ayrshare](https://integrations.do/ayrshare)

## Installation

```bash
npm install @dotdo/integration-ayrshare
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ayrshare
```

## Quick Start

```typescript
import { AyrshareClient } from '@dotdo/integration-ayrshare'

// Initialize client
const client = new AyrshareClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AyrshareClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ayrshare actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AyrshareError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AyrshareError) {
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
