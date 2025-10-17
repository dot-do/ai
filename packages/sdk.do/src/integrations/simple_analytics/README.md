# Simple analytics Integration

Simple Analytics is a privacy-friendly and simple alternative to Google Analytics, offering straightforward analytics without cookies or trackers.

**Category**: productivity
**Service**: SimpleAnalytics
**Base URL**: https://api.simple_analytics.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/simple_analytics](https://integrations.do/simple_analytics)

## Installation

```bash
npm install @dotdo/integration-simple_analytics
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-simple_analytics
```

## Quick Start

```typescript
import { SimpleAnalyticsClient } from '@dotdo/integration-simple_analytics'

// Initialize client
const client = new SimpleAnalyticsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SimpleAnalyticsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Simple analytics actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SimpleAnalyticsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SimpleAnalyticsError) {
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
