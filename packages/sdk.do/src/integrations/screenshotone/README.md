# Screenshotone Integration

ScreenshotOne is a screenshot API for developers, enabling the rendering of website screenshots through simple API calls without managing browser clusters.

**Category**: productivity
**Service**: Screenshotone
**Base URL**: https://api.screenshotone.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/screenshotone](https://integrations.do/screenshotone)

## Installation

```bash
npm install @dotdo/integration-screenshotone
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-screenshotone
```

## Quick Start

```typescript
import { ScreenshotoneClient } from '@dotdo/integration-screenshotone'

// Initialize client
const client = new ScreenshotoneClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ScreenshotoneClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Screenshotone actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ScreenshotoneError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ScreenshotoneError) {
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
