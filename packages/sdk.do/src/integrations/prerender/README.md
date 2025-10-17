# Prerender Integration

Prerender.io is a service that pre-renders JavaScript-heavy websites to improve SEO by serving static HTML versions to search engine crawlers.

**Category**: productivity
**Service**: Prerender
**Base URL**: https://api.prerender.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/prerender](https://integrations.do/prerender)

## Installation

```bash
npm install @dotdo/integration-prerender
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-prerender
```

## Quick Start

```typescript
import { PrerenderClient } from '@dotdo/integration-prerender'

// Initialize client
const client = new PrerenderClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PrerenderClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Prerender actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PrerenderError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PrerenderError) {
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
