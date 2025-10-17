# Pushbullet Integration

Pushbullet enables seamless sharing of notifications and files across devices.

**Category**: productivity
**Service**: Pushbullet
**Base URL**: https://api.pushbullet.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pushbullet](https://integrations.do/pushbullet)

## Installation

```bash
npm install @dotdo/integration-pushbullet
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pushbullet
```

## Quick Start

```typescript
import { PushbulletClient } from '@dotdo/integration-pushbullet'

// Initialize client
const client = new PushbulletClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new PushbulletClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Pushbullet actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PushbulletError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PushbulletError) {
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
