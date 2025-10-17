# Membervault Integration

MemberVault is a Relationship Marketing Platform that allows users to host courses, memberships, and other digital products in one place.

**Category**: productivity
**Service**: Membervault
**Base URL**: https://api.membervault.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/membervault](https://integrations.do/membervault)

## Installation

```bash
npm install @dotdo/integration-membervault
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-membervault
```

## Quick Start

```typescript
import { MembervaultClient } from '@dotdo/integration-membervault'

// Initialize client
const client = new MembervaultClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MembervaultClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Membervault actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MembervaultError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MembervaultError) {
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
