# Capsule crm Integration

Capsule CRM is a simple yet powerful CRM platform designed to help businesses manage customer relationships, sales pipelines, and tasks efficiently.

**Category**: crm
**Service**: CapsuleCrm
**Base URL**: https://api.capsule_crm.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/capsule_crm](https://integrations.do/capsule_crm)

## Installation

```bash
npm install @dotdo/integration-capsule_crm
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-capsule_crm
```

## Quick Start

```typescript
import { CapsuleCrmClient } from '@dotdo/integration-capsule_crm'

// Initialize client
const client = new CapsuleCrmClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new CapsuleCrmClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Capsule crm actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CapsuleCrmError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CapsuleCrmError) {
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
