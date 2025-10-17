# Anchor browser Integration

Anchor Browser is a developer platform that enables AI agents to interact with the web through browser automation, transforming complex web interactions into simple API endpoints.

**Category**: productivity
**Service**: AnchorBrowser
**Base URL**: https://api.anchor_browser.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/anchor_browser](https://integrations.do/anchor_browser)

## Installation

```bash
npm install @dotdo/integration-anchor_browser
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-anchor_browser
```

## Quick Start

```typescript
import { AnchorBrowserClient } from '@dotdo/integration-anchor_browser'

// Initialize client
const client = new AnchorBrowserClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AnchorBrowserClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Anchor browser actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AnchorBrowserError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AnchorBrowserError) {
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
