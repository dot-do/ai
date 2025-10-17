# Figma Integration

A collaborative interface design tool.

**Category**: productivity
**Service**: Figma
**Base URL**: https://api.figma.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/figma](https://integrations.do/figma)

## Installation

```bash
npm install @dotdo/integration-figma
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-figma
```

## Quick Start

```typescript
import { FigmaClient } from '@dotdo/integration-figma'

// Initialize client
const client = new FigmaClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new FigmaClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Figma actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FigmaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FigmaError) {
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
