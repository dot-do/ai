# Moz Integration

Moz is an SEO software suite providing keyword research, site audits, rank tracking, and competitive insights to boost organic search visibility

**Category**: marketing
**Service**: Moz
**Base URL**: https://api.moz.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/moz](https://integrations.do/moz)

## Installation

```bash
npm install @dotdo/integration-moz
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-moz
```

## Quick Start

```typescript
import { MozClient } from '@dotdo/integration-moz'

// Initialize client
const client = new MozClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MozClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Moz actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MozError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MozError) {
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
