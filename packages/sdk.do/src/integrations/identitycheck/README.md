# Identitycheck Integration

IdentityCheck is a verification solution designed to authenticate user identities with precision and speed, utilizing advanced algorithms and comprehensive data sources to ensure accurate validation, mitigate fraud, and enhance security.

**Category**: productivity
**Service**: Identitycheck
**Base URL**: https://api.identitycheck.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/identitycheck](https://integrations.do/identitycheck)

## Installation

```bash
npm install @dotdo/integration-identitycheck
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-identitycheck
```

## Quick Start

```typescript
import { IdentitycheckClient } from '@dotdo/integration-identitycheck'

// Initialize client
const client = new IdentitycheckClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new IdentitycheckClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Identitycheck actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `IdentitycheckError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof IdentitycheckError) {
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
