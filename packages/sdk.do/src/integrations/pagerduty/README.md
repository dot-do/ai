# Pagerduty Integration

Integrate PagerDuty to manage incidents, schedules, and alerts directly from your application.

**Category**: developer-tools
**Service**: Pagerduty
**Base URL**: https://api.pagerduty.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pagerduty](https://integrations.do/pagerduty)

## Installation

```bash
npm install @dotdo/integration-pagerduty
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pagerduty
```

## Quick Start

```typescript
import { PagerdutyClient } from '@dotdo/integration-pagerduty'

// Initialize client
const client = new PagerdutyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new PagerdutyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Pagerduty actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PagerdutyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PagerdutyError) {
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
