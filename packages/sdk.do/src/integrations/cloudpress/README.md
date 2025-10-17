# Cloudpress Integration

Cloudpress enables exporting content from Google Docs and Notion to various Content Management Systems.

**Category**: productivity
**Service**: Cloudpress
**Base URL**: https://api.cloudpress.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cloudpress](https://integrations.do/cloudpress)

## Installation

```bash
npm install @dotdo/integration-cloudpress
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cloudpress
```

## Quick Start

```typescript
import { CloudpressClient } from '@dotdo/integration-cloudpress'

// Initialize client
const client = new CloudpressClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CloudpressClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cloudpress actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CloudpressError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CloudpressError) {
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
