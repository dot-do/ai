# Servicem8 Integration

ServiceM8 helps field service businesses schedule jobs, send quotes, and manage invoices, offering staff mobile apps and real-time job status tracking

**Category**: productivity
**Service**: Servicem8
**Base URL**: https://api.servicem8.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/servicem8](https://integrations.do/servicem8)

## Installation

```bash
npm install @dotdo/integration-servicem8
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-servicem8
```

## Quick Start

```typescript
import { Servicem8Client } from '@dotdo/integration-servicem8'

// Initialize client
const client = new Servicem8Client({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new Servicem8Client({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Servicem8 actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `Servicem8Error` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof Servicem8Error) {
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
