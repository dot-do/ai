# Cutt ly Integration

Cutt.ly is a URL shortening service that allows users to shorten, manage, and analyze URLs.

**Category**: productivity
**Service**: CuttLy
**Base URL**: https://api.cutt_ly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cutt_ly](https://integrations.do/cutt_ly)

## Installation

```bash
npm install @dotdo/integration-cutt_ly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cutt_ly
```

## Quick Start

```typescript
import { CuttLyClient } from '@dotdo/integration-cutt_ly'

// Initialize client
const client = new CuttLyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CuttLyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cutt ly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CuttLyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CuttLyError) {
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
