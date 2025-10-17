# Certifier Integration

Certifier is a platform that enables organizations to create, manage, and issue digital certificates and credentials.

**Category**: productivity
**Service**: Certifier
**Base URL**: https://api.certifier.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/certifier](https://integrations.do/certifier)

## Installation

```bash
npm install @dotdo/integration-certifier
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-certifier
```

## Quick Start

```typescript
import { CertifierClient } from '@dotdo/integration-certifier'

// Initialize client
const client = new CertifierClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CertifierClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Certifier actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CertifierError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CertifierError) {
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
