# Google BigQuery Integration

Google BigQuery is a fully managed data warehouse for large-scale data analytics, offering fast SQL queries and machine learning capabilities on massive datasets

**Category**: analytics
**Service**: Googlebigquery
**Base URL**: https://api.googlebigquery.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/googlebigquery](https://integrations.do/googlebigquery)

## Installation

```bash
npm install @dotdo/integration-googlebigquery
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-googlebigquery
```

## Quick Start

```typescript
import { GooglebigqueryClient } from '@dotdo/integration-googlebigquery'

// Initialize client
const client = new GooglebigqueryClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GooglebigqueryClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Google BigQuery actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GooglebigqueryError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GooglebigqueryError) {
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
