# Tripadvisor content api Integration

The Tripadvisor Content API provides developers with access to Tripadvisor’s extensive data set, including over 7.5 million locations, 1 billion reviews and opinions, and support for 29 languages.

**Category**: productivity
**Service**: TripadvisorContentApi
**Base URL**: https://api.tripadvisor_content_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tripadvisor_content_api](https://integrations.do/tripadvisor_content_api)

## Installation

```bash
npm install @dotdo/integration-tripadvisor_content_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tripadvisor_content_api
```

## Quick Start

```typescript
import { TripadvisorContentApiClient } from '@dotdo/integration-tripadvisor_content_api'

// Initialize client
const client = new TripadvisorContentApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TripadvisorContentApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Tripadvisor content api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TripadvisorContentApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TripadvisorContentApiError) {
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
