# Apify Integration

Apify is a platform for building, deploying, and managing web scraping and automation tools, known as Actors.

**Category**: productivity
**Service**: Apify
**Base URL**: https://api.apify.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apify](https://integrations.do/apify)

## Installation

```bash
npm install @dotdo/integration-apify
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apify
```

## Quick Start

```typescript
import { ApifyClient } from '@dotdo/integration-apify'

// Initialize client
const client = new ApifyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApifyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Apify actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApifyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApifyError) {
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
