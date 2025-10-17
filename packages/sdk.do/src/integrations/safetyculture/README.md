# Safetyculture Integration

SafetyCulture is a platform that empowers teams to improve workplace safety, quality, and efficiency through digital inspections and audits.

**Category**: productivity
**Service**: Safetyculture
**Base URL**: https://api.safetyculture.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/safetyculture](https://integrations.do/safetyculture)

## Installation

```bash
npm install @dotdo/integration-safetyculture
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-safetyculture
```

## Quick Start

```typescript
import { SafetycultureClient } from '@dotdo/integration-safetyculture'

// Initialize client
const client = new SafetycultureClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SafetycultureClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Safetyculture actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SafetycultureError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SafetycultureError) {
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
