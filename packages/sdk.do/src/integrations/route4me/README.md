# Route4me Integration

Route4Me provides a Last Mile Routing API offering automated solutions for route planning and optimization, tailored for logistics-intensive businesses.

**Category**: productivity
**Service**: Route4me
**Base URL**: https://api.route4me.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/route4me](https://integrations.do/route4me)

## Installation

```bash
npm install @dotdo/integration-route4me
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-route4me
```

## Quick Start

```typescript
import { Route4meClient } from '@dotdo/integration-route4me'

// Initialize client
const client = new Route4meClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new Route4meClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Route4me actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Route4meError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Route4meError) {
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
