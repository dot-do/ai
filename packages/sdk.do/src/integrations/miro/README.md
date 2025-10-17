# Miro Integration

Miro is a collaborative online whiteboard enabling teams to brainstorm ideas, design wireframes, plan workflows, and manage projects visually

**Category**: productivity
**Service**: Miro
**Base URL**: https://api.miro.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/miro](https://integrations.do/miro)

## Installation

```bash
npm install @dotdo/integration-miro
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-miro
```

## Quick Start

```typescript
import { MiroClient } from '@dotdo/integration-miro'

// Initialize client
const client = new MiroClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new MiroClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Miro actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MiroError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MiroError) {
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
