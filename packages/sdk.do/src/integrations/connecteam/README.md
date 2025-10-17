# Connecteam Integration

Connecteam is a comprehensive workforce management platform designed to streamline operations, enhance communication, and improve HR processes for deskless teams.

**Category**: productivity
**Service**: Connecteam
**Base URL**: https://api.connecteam.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/connecteam](https://integrations.do/connecteam)

## Installation

```bash
npm install @dotdo/integration-connecteam
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-connecteam
```

## Quick Start

```typescript
import { ConnecteamClient } from '@dotdo/integration-connecteam'

// Initialize client
const client = new ConnecteamClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ConnecteamClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Connecteam actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ConnecteamError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ConnecteamError) {
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
