# Toneden Integration

ToneDen automates social media campaigns, advertising, and landing pages, particularly for music promoters and event organizers looking to boost audience reach

**Category**: marketing
**Service**: Toneden
**Base URL**: https://api.toneden.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/toneden](https://integrations.do/toneden)

## Installation

```bash
npm install @dotdo/integration-toneden
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-toneden
```

## Quick Start

```typescript
import { TonedenClient } from '@dotdo/integration-toneden'

// Initialize client
const client = new TonedenClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TonedenClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Toneden actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TonedenError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TonedenError) {
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
