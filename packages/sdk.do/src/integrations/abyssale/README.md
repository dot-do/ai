# Abyssale Integration

Abyssale is a creative automation platform that enables users to generate images, videos, GIFs, PDFs, and HTML5 content programmatically, streamlining visual content production.

**Category**: productivity
**Service**: Abyssale
**Base URL**: https://api.abyssale.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/abyssale](https://integrations.do/abyssale)

## Installation

```bash
npm install @dotdo/integration-abyssale
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-abyssale
```

## Quick Start

```typescript
import { AbyssaleClient } from '@dotdo/integration-abyssale'

// Initialize client
const client = new AbyssaleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AbyssaleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Abyssale actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AbyssaleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AbyssaleError) {
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
