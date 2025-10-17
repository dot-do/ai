# Webflow Integration

Webflow is a no-code website design and hosting platform, letting users build responsive sites, launch online stores, and maintain content without coding

**Category**: productivity
**Service**: Webflow
**Base URL**: https://api.webflow.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/webflow](https://integrations.do/webflow)

## Installation

```bash
npm install @dotdo/integration-webflow
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-webflow
```

## Quick Start

```typescript
import { WebflowClient } from '@dotdo/integration-webflow'

// Initialize client
const client = new WebflowClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new WebflowClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Webflow actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WebflowError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WebflowError) {
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
