# Elevenlabs Integration

Create natural AI voices instantly in any language - perfect for video creators, developers, and businesses.

**Category**: communication
**Service**: Elevenlabs
**Base URL**: https://api.elevenlabs.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/elevenlabs](https://integrations.do/elevenlabs)

## Installation

```bash
npm install @dotdo/integration-elevenlabs
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-elevenlabs
```

## Quick Start

```typescript
import { ElevenlabsClient } from '@dotdo/integration-elevenlabs'

// Initialize client
const client = new ElevenlabsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ElevenlabsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Elevenlabs actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ElevenlabsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ElevenlabsError) {
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
