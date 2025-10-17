# Shorten rest Integration

Shorten.REST is a link shortening and management app that allows you to generate unique, branded URLs with advanced tracking capabilities.

**Category**: productivity
**Service**: ShortenRest
**Base URL**: https://api.shorten_rest.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/shorten_rest](https://integrations.do/shorten_rest)

## Installation

```bash
npm install @dotdo/integration-shorten_rest
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-shorten_rest
```

## Quick Start

```typescript
import { ShortenRestClient } from '@dotdo/integration-shorten_rest'

// Initialize client
const client = new ShortenRestClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ShortenRestClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Shorten rest actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ShortenRestError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ShortenRestError) {
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
