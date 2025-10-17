# Zyte api Integration

Zyte API is a web scraping solution that automates data extraction from websites, handling challenges like bans and dynamic content.

**Category**: productivity
**Service**: ZyteApi
**Base URL**: https://api.zyte_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zyte_api](https://integrations.do/zyte_api)

## Installation

```bash
npm install @dotdo/integration-zyte_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zyte_api
```

## Quick Start

```typescript
import { ZyteApiClient } from '@dotdo/integration-zyte_api'

// Initialize client
const client = new ZyteApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ZyteApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Zyte api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZyteApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZyteApiError) {
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
