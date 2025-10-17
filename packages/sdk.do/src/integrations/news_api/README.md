# News api Integration

News API is a simple HTTP REST API for searching and retrieving live articles from all over the web.

**Category**: productivity
**Service**: NewsApi
**Base URL**: https://api.news_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/news_api](https://integrations.do/news_api)

## Installation

```bash
npm install @dotdo/integration-news_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-news_api
```

## Quick Start

```typescript
import { NewsApiClient } from '@dotdo/integration-news_api'

// Initialize client
const client = new NewsApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NewsApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute News api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NewsApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NewsApiError) {
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
