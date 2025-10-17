# Serpapi Integration

SerpApi provides a real-time API for structured search engine results, allowing developers to scrape, parse, and analyze SERP data for SEO and research

**Category**: analytics
**Service**: Serpapi
**Base URL**: https://api.serpapi.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/serpapi](https://integrations.do/serpapi)

## Installation

```bash
npm install @dotdo/integration-serpapi
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-serpapi
```

## Quick Start

```typescript
import { SerpapiClient } from '@dotdo/integration-serpapi'

// Initialize client
const client = new SerpapiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SerpapiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Serpapi actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SerpapiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SerpapiError) {
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
