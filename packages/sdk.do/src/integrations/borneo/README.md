# Borneo Integration

Borneo is a data security and privacy platform designed for sensitive data discovery and remediation.

**Category**: productivity
**Service**: Borneo
**Base URL**: https://api.borneo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/borneo](https://integrations.do/borneo)

## Installation

```bash
npm install @dotdo/integration-borneo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-borneo
```

## Quick Start

```typescript
import { BorneoClient } from '@dotdo/integration-borneo'

// Initialize client
const client = new BorneoClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BorneoClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Borneo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BorneoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BorneoError) {
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
