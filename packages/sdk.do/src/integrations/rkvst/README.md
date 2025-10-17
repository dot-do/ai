# Rkvst Integration

DataTrails provides an evidence management platform that delivers a reliable chain of custody for supply chain data, ensuring data authenticity and transparency.

**Category**: productivity
**Service**: Rkvst
**Base URL**: https://api.rkvst.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/rkvst](https://integrations.do/rkvst)

## Installation

```bash
npm install @dotdo/integration-rkvst
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-rkvst
```

## Quick Start

```typescript
import { RkvstClient } from '@dotdo/integration-rkvst'

// Initialize client
const client = new RkvstClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RkvstClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Rkvst actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RkvstError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RkvstError) {
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
