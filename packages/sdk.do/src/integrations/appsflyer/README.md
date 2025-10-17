# Appsflyer Integration

AppsFlyer is a mobile attribution and marketing analytics platform enabling marketers to measure campaign performance, optimize acquisition channels, and protect against fraud for app growth

**Category**: marketing
**Service**: Appsflyer
**Base URL**: https://api.appsflyer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/appsflyer](https://integrations.do/appsflyer)

## Installation

```bash
npm install @dotdo/integration-appsflyer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-appsflyer
```

## Quick Start

```typescript
import { AppsflyerClient } from '@dotdo/integration-appsflyer'

// Initialize client
const client = new AppsflyerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AppsflyerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Appsflyer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AppsflyerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AppsflyerError) {
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
