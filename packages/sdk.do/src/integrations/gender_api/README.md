# Gender api Integration

Gender API determines the gender of a first name, email address, or username.

**Category**: productivity
**Service**: GenderApi
**Base URL**: https://api.gender_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gender_api](https://integrations.do/gender_api)

## Installation

```bash
npm install @dotdo/integration-gender_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gender_api
```

## Quick Start

```typescript
import { GenderApiClient } from '@dotdo/integration-gender_api'

// Initialize client
const client = new GenderApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GenderApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Gender api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GenderApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GenderApiError) {
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
