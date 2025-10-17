# Wakatime Integration

WakaTime offers automatic time tracking for developers, integrating with code editors and delivering dashboards on coding activity, project progress, and productivity

**Category**: productivity
**Service**: Wakatime
**Base URL**: https://api.wakatime.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/wakatime](https://integrations.do/wakatime)

## Installation

```bash
npm install @dotdo/integration-wakatime
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-wakatime
```

## Quick Start

```typescript
import { WakatimeClient } from '@dotdo/integration-wakatime'

// Initialize client
const client = new WakatimeClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new WakatimeClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Wakatime actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WakatimeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WakatimeError) {
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
