# Attio Integration

Attio is a fully customizable workspace for your team's relationships and workflows.

**Category**: crm
**Service**: Attio
**Base URL**: https://api.attio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/attio](https://integrations.do/attio)

## Installation

```bash
npm install @dotdo/integration-attio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-attio
```

## Quick Start

```typescript
import { AttioClient } from '@dotdo/integration-attio'

// Initialize client
const client = new AttioClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new AttioClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Attio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AttioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AttioError) {
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
