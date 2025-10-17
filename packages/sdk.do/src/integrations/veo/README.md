# Veo Integration

Veo 3 is Google's state-of-the-art model for generating high-fidelity 8s 720p videos with natively generated audio via the Gemini API.

**Category**: productivity
**Service**: Veo
**Base URL**: https://api.veo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/veo](https://integrations.do/veo)

## Installation

```bash
npm install @dotdo/integration-veo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-veo
```

## Quick Start

```typescript
import { VeoClient } from '@dotdo/integration-veo'

// Initialize client
const client = new VeoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new VeoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Veo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `VeoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof VeoError) {
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
