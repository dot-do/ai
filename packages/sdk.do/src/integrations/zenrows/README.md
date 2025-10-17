# Zenrows Integration

ZenRows is a web scraping API allowing developers to bypass CAPTCHAs and blocks, gather structured data from dynamic websites, and quickly integrate results into applications

**Category**: developer-tools
**Service**: Zenrows
**Base URL**: https://api.zenrows.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zenrows](https://integrations.do/zenrows)

## Installation

```bash
npm install @dotdo/integration-zenrows
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zenrows
```

## Quick Start

```typescript
import { ZenrowsClient } from '@dotdo/integration-zenrows'

// Initialize client
const client = new ZenrowsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ZenrowsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Zenrows actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZenrowsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZenrowsError) {
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
