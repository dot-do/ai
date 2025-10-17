# Sendspark Integration

Sendspark is a video messaging platform that empowers businesses to create, send, and track personalized video content, simplifying communication by allowing users to quickly record or upload videos and share them via email, social media, or other digital channels.

**Category**: productivity
**Service**: Sendspark
**Base URL**: https://api.sendspark.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sendspark](https://integrations.do/sendspark)

## Installation

```bash
npm install @dotdo/integration-sendspark
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sendspark
```

## Quick Start

```typescript
import { SendsparkClient } from '@dotdo/integration-sendspark'

// Initialize client
const client = new SendsparkClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SendsparkClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sendspark actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SendsparkError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SendsparkError) {
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
