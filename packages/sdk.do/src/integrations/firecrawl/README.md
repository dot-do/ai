# Firecrawl Integration

Firecrawl automates web crawling and data extraction, enabling organizations to gather content, index sites, and gain insights from online sources at scale

**Category**: analytics
**Service**: Firecrawl
**Base URL**: https://api.firecrawl.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/firecrawl](https://integrations.do/firecrawl)

## Installation

```bash
npm install @dotdo/integration-firecrawl
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-firecrawl
```

## Quick Start

```typescript
import { FirecrawlClient } from '@dotdo/integration-firecrawl'

// Initialize client
const client = new FirecrawlClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FirecrawlClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Firecrawl actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FirecrawlError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FirecrawlError) {
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
