# Ahrefs Integration

Ahrefs is an SEO and marketing platform offering site audits, keyword research, content analysis, and competitive insights to improve search rankings and drive organic traffic

**Category**: marketing
**Service**: Ahrefs
**Base URL**: https://api.ahrefs.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ahrefs](https://integrations.do/ahrefs)

## Installation

```bash
npm install @dotdo/integration-ahrefs
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ahrefs
```

## Quick Start

```typescript
import { AhrefsClient } from '@dotdo/integration-ahrefs'

// Initialize client
const client = new AhrefsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AhrefsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ahrefs actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AhrefsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AhrefsError) {
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
