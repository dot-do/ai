# Plasmic Integration

Plasmic is a visual builder for the web, enabling teams to create and manage web pages and components without code.

**Category**: productivity
**Service**: Plasmic
**Base URL**: https://api.plasmic.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/plasmic](https://integrations.do/plasmic)

## Installation

```bash
npm install @dotdo/integration-plasmic
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-plasmic
```

## Quick Start

```typescript
import { PlasmicClient } from '@dotdo/integration-plasmic'

// Initialize client
const client = new PlasmicClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PlasmicClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Plasmic actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PlasmicError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PlasmicError) {
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
