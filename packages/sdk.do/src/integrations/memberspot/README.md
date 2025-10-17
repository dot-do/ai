# Memberspot Integration

Memberspot is an online course and video-hosting platform designed to facilitate knowledge management and community engagement for businesses.

**Category**: productivity
**Service**: Memberspot
**Base URL**: https://api.memberspot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/memberspot](https://integrations.do/memberspot)

## Installation

```bash
npm install @dotdo/integration-memberspot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-memberspot
```

## Quick Start

```typescript
import { MemberspotClient } from '@dotdo/integration-memberspot'

// Initialize client
const client = new MemberspotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MemberspotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Memberspot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MemberspotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MemberspotError) {
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
