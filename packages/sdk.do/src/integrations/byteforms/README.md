# Byteforms Integration

All-in-one solution for form creation, submission management, and data integration.

**Category**: productivity
**Service**: Byteforms
**Base URL**: https://api.byteforms.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/byteforms](https://integrations.do/byteforms)

## Installation

```bash
npm install @dotdo/integration-byteforms
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-byteforms
```

## Quick Start

```typescript
import { ByteformsClient } from '@dotdo/integration-byteforms'

// Initialize client
const client = new ByteformsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ByteformsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Byteforms actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ByteformsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ByteformsError) {
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
