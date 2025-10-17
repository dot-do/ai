# Cloudflare browser rendering Integration

Cloudflare Browser Rendering enables developers to programmatically control and interact with headless browser instances running on Cloudflare’s global network, facilitating tasks such as automating browser interactions, capturing screenshots, generating PDFs, and extracting data from web pages.

**Category**: productivity
**Service**: CloudflareBrowserRendering
**Base URL**: https://api.cloudflare_browser_rendering.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cloudflare_browser_rendering](https://integrations.do/cloudflare_browser_rendering)

## Installation

```bash
npm install @dotdo/integration-cloudflare_browser_rendering
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cloudflare_browser_rendering
```

## Quick Start

```typescript
import { CloudflareBrowserRenderingClient } from '@dotdo/integration-cloudflare_browser_rendering'

// Initialize client
const client = new CloudflareBrowserRenderingClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CloudflareBrowserRenderingClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cloudflare browser rendering actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CloudflareBrowserRenderingError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CloudflareBrowserRenderingError) {
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
