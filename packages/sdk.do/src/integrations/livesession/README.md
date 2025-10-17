# Livesession Integration

LiveSession is a session replay and user behavior analytics tool that helps you understand how users interact with your website.

**Category**: productivity
**Service**: Livesession
**Base URL**: https://api.livesession.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/livesession](https://integrations.do/livesession)

## Installation

```bash
npm install @dotdo/integration-livesession
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-livesession
```

## Quick Start

```typescript
import { LivesessionClient } from '@dotdo/integration-livesession'

// Initialize client
const client = new LivesessionClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LivesessionClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Livesession actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LivesessionError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LivesessionError) {
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
