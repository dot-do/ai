# Ravenseotools Integration

Raven SEO Tools provides site auditing, rank tracking, and marketing reporting, helping digital marketers monitor and improve their online presence

**Category**: marketing
**Service**: Ravenseotools
**Base URL**: https://api.ravenseotools.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ravenseotools](https://integrations.do/ravenseotools)

## Installation

```bash
npm install @dotdo/integration-ravenseotools
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ravenseotools
```

## Quick Start

```typescript
import { RavenseotoolsClient } from '@dotdo/integration-ravenseotools'

// Initialize client
const client = new RavenseotoolsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RavenseotoolsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ravenseotools actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RavenseotoolsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RavenseotoolsError) {
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
