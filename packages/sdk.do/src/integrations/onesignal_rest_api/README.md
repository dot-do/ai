# Onesignal rest api Integration

The OneSignal REST API enables developers to programmatically send push notifications, emails, and SMS, manage users and subscriptions, and configure apps.

**Category**: productivity
**Service**: OnesignalRestApi
**Base URL**: https://api.onesignal_rest_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/onesignal_rest_api](https://integrations.do/onesignal_rest_api)

## Installation

```bash
npm install @dotdo/integration-onesignal_rest_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-onesignal_rest_api
```

## Quick Start

```typescript
import { OnesignalRestApiClient } from '@dotdo/integration-onesignal_rest_api'

// Initialize client
const client = new OnesignalRestApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new OnesignalRestApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Onesignal rest api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `OnesignalRestApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof OnesignalRestApiError) {
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
