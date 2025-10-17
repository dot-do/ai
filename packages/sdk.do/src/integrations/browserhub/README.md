# Browserhub Integration

Browserhub supports web automation and data extraction, letting users build workflows, scrape information, and integrate insights into their analytics pipelines

**Category**: productivity
**Service**: Browserhub
**Base URL**: https://api.browserhub.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/browserhub](https://integrations.do/browserhub)

## Installation

```bash
npm install @dotdo/integration-browserhub
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-browserhub
```

## Quick Start

```typescript
import { BrowserhubClient } from '@dotdo/integration-browserhub'

// Initialize client
const client = new BrowserhubClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BrowserhubClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Browserhub actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrowserhubError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrowserhubError) {
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
