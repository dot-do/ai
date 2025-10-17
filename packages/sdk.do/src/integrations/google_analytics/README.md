# Google Analytics Integration

Google Analytics tracks and reports website traffic, user behavior, and conversion data, enabling marketers to optimize online performance and customer journeys

**Category**: analytics
**Service**: GoogleAnalytics
**Base URL**: https://api.google_analytics.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/google_analytics](https://integrations.do/google_analytics)

## Installation

```bash
npm install @dotdo/integration-google_analytics
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-google_analytics
```

## Quick Start

```typescript
import { GoogleAnalyticsClient } from '@dotdo/integration-google_analytics'

// Initialize client
const client = new GoogleAnalyticsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogleAnalyticsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Analytics actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogleAnalyticsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogleAnalyticsError) {
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
