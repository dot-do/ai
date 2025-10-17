# Klaviyo Integration

Klaviyo is a data-driven email and SMS marketing platform that allows e-commerce brands to deliver targeted messages, track conversions, and scale customer relationships

**Category**: marketing
**Service**: Klaviyo
**Base URL**: https://api.klaviyo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/klaviyo](https://integrations.do/klaviyo)

## Installation

```bash
npm install @dotdo/integration-klaviyo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-klaviyo
```

## Quick Start

```typescript
import { KlaviyoClient } from '@dotdo/integration-klaviyo'

// Initialize client
const client = new KlaviyoClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new KlaviyoClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Klaviyo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KlaviyoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KlaviyoError) {
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
