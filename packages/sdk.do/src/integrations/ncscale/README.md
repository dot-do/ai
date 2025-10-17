# Ncscale Integration

NCScale offers analytics and data management capabilities, potentially helping companies consolidate, process, and visualize information from multiple sources

**Category**: analytics
**Service**: Ncscale
**Base URL**: https://api.ncscale.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ncscale](https://integrations.do/ncscale)

## Installation

```bash
npm install @dotdo/integration-ncscale
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ncscale
```

## Quick Start

```typescript
import { NcscaleClient } from '@dotdo/integration-ncscale'

// Initialize client
const client = new NcscaleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NcscaleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ncscale actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NcscaleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NcscaleError) {
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
