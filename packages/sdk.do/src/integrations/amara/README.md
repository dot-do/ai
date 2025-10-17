# Amara Integration

Amara is an online platform that enables users to create, edit, and manage subtitles and captions for videos, facilitating accessibility and multilingual content.

**Category**: productivity
**Service**: Amara
**Base URL**: https://api.amara.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/amara](https://integrations.do/amara)

## Installation

```bash
npm install @dotdo/integration-amara
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-amara
```

## Quick Start

```typescript
import { AmaraClient } from '@dotdo/integration-amara'

// Initialize client
const client = new AmaraClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AmaraClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Amara actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AmaraError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AmaraError) {
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
