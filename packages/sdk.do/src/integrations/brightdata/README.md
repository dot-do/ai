# Brightdata Integration

Bright Data provides the world's

**Category**: productivity
**Service**: Brightdata
**Base URL**: https://api.brightdata.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/brightdata](https://integrations.do/brightdata)

## Installation

```bash
npm install @dotdo/integration-brightdata
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-brightdata
```

## Quick Start

```typescript
import { BrightdataClient } from '@dotdo/integration-brightdata'

// Initialize client
const client = new BrightdataClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BrightdataClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Brightdata actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrightdataError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrightdataError) {
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
