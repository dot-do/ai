# Serply Integration

Serply is a Python SDK for the Serply API, providing a simple interface to access various search engine results, including web, video, image, maps, news, SERP, crawl, product, and job searches.

**Category**: productivity
**Service**: Serply
**Base URL**: https://api.serply.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/serply](https://integrations.do/serply)

## Installation

```bash
npm install @dotdo/integration-serply
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-serply
```

## Quick Start

```typescript
import { SerplyClient } from '@dotdo/integration-serply'

// Initialize client
const client = new SerplyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SerplyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Serply actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SerplyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SerplyError) {
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
