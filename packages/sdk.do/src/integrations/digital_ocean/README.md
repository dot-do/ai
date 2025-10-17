# Digital ocean Integration

DigitalOcean is a cloud infrastructure provider offering scalable compute platforms with a user-friendly interface.

**Category**: productivity
**Service**: DigitalOcean
**Base URL**: https://api.digital_ocean.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/digital_ocean](https://integrations.do/digital_ocean)

## Installation

```bash
npm install @dotdo/integration-digital_ocean
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-digital_ocean
```

## Quick Start

```typescript
import { DigitalOceanClient } from '@dotdo/integration-digital_ocean'

// Initialize client
const client = new DigitalOceanClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new DigitalOceanClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Digital ocean actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DigitalOceanError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DigitalOceanError) {
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
