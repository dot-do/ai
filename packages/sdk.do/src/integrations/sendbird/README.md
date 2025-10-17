# Sendbird Integration

Sendbird is a platform that provides chat, voice, and video APIs to help businesses build in-app communication features.

**Category**: productivity
**Service**: Sendbird
**Base URL**: https://api.sendbird.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sendbird](https://integrations.do/sendbird)

## Installation

```bash
npm install @dotdo/integration-sendbird
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sendbird
```

## Quick Start

```typescript
import { SendbirdClient } from '@dotdo/integration-sendbird'

// Initialize client
const client = new SendbirdClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SendbirdClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sendbird actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SendbirdError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SendbirdError) {
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
