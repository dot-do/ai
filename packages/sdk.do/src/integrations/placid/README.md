# Placid Integration

Placid is a creative automation toolkit that enables users to generate images, PDFs, and videos from custom templates via REST or URL APIs.

**Category**: productivity
**Service**: Placid
**Base URL**: https://api.placid.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/placid](https://integrations.do/placid)

## Installation

```bash
npm install @dotdo/integration-placid
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-placid
```

## Quick Start

```typescript
import { PlacidClient } from '@dotdo/integration-placid'

// Initialize client
const client = new PlacidClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PlacidClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Placid actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PlacidError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PlacidError) {
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
