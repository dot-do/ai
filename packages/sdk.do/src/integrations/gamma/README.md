# Gamma Integration

Gamma helps create beautiful, interactive content and presentations using AI. This integration enables programmatic generation via Gamma’s API.

**Category**: productivity
**Service**: Gamma
**Base URL**: https://api.gamma.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/gamma](https://integrations.do/gamma)

## Installation

```bash
npm install @dotdo/integration-gamma
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-gamma
```

## Quick Start

```typescript
import { GammaClient } from '@dotdo/integration-gamma'

// Initialize client
const client = new GammaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GammaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Gamma actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GammaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GammaError) {
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
