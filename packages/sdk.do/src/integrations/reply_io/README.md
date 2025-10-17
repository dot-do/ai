# Reply io Integration

Reply.io is an AI-powered sales engagement platform that automates and optimizes sales outreach across multiple channels, integrating with various business tools to enhance lead conversion rates and overall sales productivity.

**Category**: productivity
**Service**: ReplyIo
**Base URL**: https://api.reply_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/reply_io](https://integrations.do/reply_io)

## Installation

```bash
npm install @dotdo/integration-reply_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-reply_io
```

## Quick Start

```typescript
import { ReplyIoClient } from '@dotdo/integration-reply_io'

// Initialize client
const client = new ReplyIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ReplyIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Reply io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ReplyIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ReplyIoError) {
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
