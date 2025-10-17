# Accelo Integration

Accelo offers a unified platform for professional service teams, combining project management, CRM, billing, and analytics to enhance client work visibility and overall operational efficiency

**Category**: productivity
**Service**: Accelo
**Base URL**: https://api.accelo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/accelo](https://integrations.do/accelo)

## Installation

```bash
npm install @dotdo/integration-accelo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-accelo
```

## Quick Start

```typescript
import { AcceloClient } from '@dotdo/integration-accelo'

// Initialize client
const client = new AcceloClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new AcceloClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Accelo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AcceloError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AcceloError) {
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
