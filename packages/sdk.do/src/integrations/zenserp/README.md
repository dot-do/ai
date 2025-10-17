# Zenserp Integration

Zenserp is a real-time SERP API that extracts Google Search results in JSON format.

**Category**: productivity
**Service**: Zenserp
**Base URL**: https://api.zenserp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zenserp](https://integrations.do/zenserp)

## Installation

```bash
npm install @dotdo/integration-zenserp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zenserp
```

## Quick Start

```typescript
import { ZenserpClient } from '@dotdo/integration-zenserp'

// Initialize client
const client = new ZenserpClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ZenserpClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Zenserp actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZenserpError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZenserpError) {
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
