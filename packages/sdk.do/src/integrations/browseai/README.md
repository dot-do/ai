# Browseai Integration

Browse.ai allows you to turn any website into an API using its advanced web automation and data extraction tools, enabling easy monitoring and data retrieval from websites.

**Category**: analytics
**Service**: Browseai
**Base URL**: https://api.browseai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/browseai](https://integrations.do/browseai)

## Installation

```bash
npm install @dotdo/integration-browseai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-browseai
```

## Quick Start

```typescript
import { BrowseaiClient } from '@dotdo/integration-browseai'

// Initialize client
const client = new BrowseaiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BrowseaiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Browseai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrowseaiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrowseaiError) {
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
