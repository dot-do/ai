# Highlevel Integration

HighLevel provides a marketing automation and CRM platform for agencies, featuring funnels, appointment scheduling, two-way texting, and other tools to drive client success

**Category**: marketing
**Service**: Highlevel
**Base URL**: https://api.highlevel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/highlevel](https://integrations.do/highlevel)

## Installation

```bash
npm install @dotdo/integration-highlevel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-highlevel
```

## Quick Start

```typescript
import { HighlevelClient } from '@dotdo/integration-highlevel'

// Initialize client
const client = new HighlevelClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new HighlevelClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Highlevel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HighlevelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HighlevelError) {
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
