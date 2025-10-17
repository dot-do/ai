# Api bible Integration

API.Bible allows developers to integrate Scripture content into their applications or websites for non-commercial purposes.

**Category**: productivity
**Service**: ApiBible
**Base URL**: https://api.api_bible.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/api_bible](https://integrations.do/api_bible)

## Installation

```bash
npm install @dotdo/integration-api_bible
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-api_bible
```

## Quick Start

```typescript
import { ApiBibleClient } from '@dotdo/integration-api_bible'

// Initialize client
const client = new ApiBibleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApiBibleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Api bible actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApiBibleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApiBibleError) {
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
