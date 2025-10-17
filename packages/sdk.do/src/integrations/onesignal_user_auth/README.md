# Onesignal user auth Integration

OneSignal is a customer engagement platform offering push notifications, email, SMS, and in-app messaging services.

**Category**: productivity
**Service**: OnesignalUserAuth
**Base URL**: https://api.onesignal_user_auth.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/onesignal_user_auth](https://integrations.do/onesignal_user_auth)

## Installation

```bash
npm install @dotdo/integration-onesignal_user_auth
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-onesignal_user_auth
```

## Quick Start

```typescript
import { OnesignalUserAuthClient } from '@dotdo/integration-onesignal_user_auth'

// Initialize client
const client = new OnesignalUserAuthClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OnesignalUserAuthClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Onesignal user auth actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OnesignalUserAuthError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OnesignalUserAuthError) {
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
