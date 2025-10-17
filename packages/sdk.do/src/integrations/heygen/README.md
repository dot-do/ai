# Heygen Integration

HeyGen is an innovative video platform that harnesses the power of generative AI to streamline your video creation process

**Category**: productivity
**Service**: Heygen
**Base URL**: https://api.heygen.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/heygen](https://integrations.do/heygen)

## Installation

```bash
npm install @dotdo/integration-heygen
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-heygen
```

## Quick Start

```typescript
import { HeygenClient } from '@dotdo/integration-heygen'

// Initialize client
const client = new HeygenClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HeygenClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Heygen actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HeygenError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HeygenError) {
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
