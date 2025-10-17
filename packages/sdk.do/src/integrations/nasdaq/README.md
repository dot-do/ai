# Nasdaq Integration

Nasdaq Data Link provides a modern and efficient method of delivering real-time exchange data and other financial information through a suite of APIs, enabling seamless integration and rapid deployment of data-driven applications.

**Category**: productivity
**Service**: Nasdaq
**Base URL**: https://api.nasdaq.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/nasdaq](https://integrations.do/nasdaq)

## Installation

```bash
npm install @dotdo/integration-nasdaq
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-nasdaq
```

## Quick Start

```typescript
import { NasdaqClient } from '@dotdo/integration-nasdaq'

// Initialize client
const client = new NasdaqClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NasdaqClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Nasdaq actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NasdaqError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NasdaqError) {
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
