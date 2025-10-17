# Ring central Integration

RingCentral offers cloud-based communication services including voice, video meetings, team messaging, and contact center solutions for businesses of all sizes

**Category**: communication
**Service**: RingCentral
**Base URL**: https://api.ring_central.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ring_central](https://integrations.do/ring_central)

## Installation

```bash
npm install @dotdo/integration-ring_central
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ring_central
```

## Quick Start

```typescript
import { RingCentralClient } from '@dotdo/integration-ring_central'

// Initialize client
const client = new RingCentralClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new RingCentralClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Ring central actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RingCentralError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RingCentralError) {
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
