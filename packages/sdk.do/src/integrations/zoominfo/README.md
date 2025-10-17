# Zoominfo Integration

AgencyZoom is for the P&C insurance agent that's looking to increase sales, boost retention and analyze agency & producer performance.

**Category**: crm
**Service**: Zoominfo
**Base URL**: https://api.zoominfo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/zoominfo](https://integrations.do/zoominfo)

## Installation

```bash
npm install @dotdo/integration-zoominfo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-zoominfo
```

## Quick Start

```typescript
import { ZoominfoClient } from '@dotdo/integration-zoominfo'

// Initialize client
const client = new ZoominfoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ZoominfoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Zoominfo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ZoominfoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ZoominfoError) {
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
