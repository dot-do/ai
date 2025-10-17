# Gagelist Integration

GageList is a user-friendly calibration management platform that simplifies the integration process with intuitive interfaces and straightforward APIs, enabling seamless connection with existing tools and workflows.

**Category**: productivity
**Service**: Gagelist
**Base URL**: https://api.gagelist.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gagelist](https://integrations.do/gagelist)

## Installation

```bash
npm install @dotdo/integration-gagelist
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gagelist
```

## Quick Start

```typescript
import { GagelistClient } from '@dotdo/integration-gagelist'

// Initialize client
const client = new GagelistClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GagelistClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Gagelist actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GagelistError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GagelistError) {
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
