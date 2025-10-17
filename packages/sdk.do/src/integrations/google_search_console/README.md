# Google search console Integration

Google Search Console provides tools to monitor, maintain, and troubleshoot your site's presence in Google Search results.

**Category**: productivity
**Service**: GoogleSearchConsole
**Base URL**: https://api.google_search_console.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/google_search_console](https://integrations.do/google_search_console)

## Installation

```bash
npm install @dotdo/integration-google_search_console
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-google_search_console
```

## Quick Start

```typescript
import { GoogleSearchConsoleClient } from '@dotdo/integration-google_search_console'

// Initialize client
const client = new GoogleSearchConsoleClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogleSearchConsoleClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google search console actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogleSearchConsoleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogleSearchConsoleError) {
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
