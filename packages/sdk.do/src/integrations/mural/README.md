# Mural Integration

Mural is a digital whiteboard platform enabling distributed teams to visually brainstorm, map ideas, and collaborate in real time with sticky notes and diagrams

**Category**: productivity
**Service**: Mural
**Base URL**: https://api.mural.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mural](https://integrations.do/mural)

## Installation

```bash
npm install @dotdo/integration-mural
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mural
```

## Quick Start

```typescript
import { MuralClient } from '@dotdo/integration-mural'

// Initialize client
const client = new MuralClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new MuralClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Mural actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MuralError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MuralError) {
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
