# Mocean Integration

Mocean enables SMS, voice, and verification services, integrating messaging capabilities into applications for multifactor authentication or customer engagement

**Category**: communication
**Service**: Mocean
**Base URL**: https://api.mocean.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mocean](https://integrations.do/mocean)

## Installation

```bash
npm install @dotdo/integration-mocean
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mocean
```

## Quick Start

```typescript
import { MoceanClient } from '@dotdo/integration-mocean'

// Initialize client
const client = new MoceanClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MoceanClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mocean actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MoceanError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MoceanError) {
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
