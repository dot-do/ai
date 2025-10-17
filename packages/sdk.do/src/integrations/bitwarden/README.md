# Bitwarden Integration

Bitwarden is a secure password management solution providing encrypted vaults, cross-platform sync, and enterprise-grade security tools for storing and sharing credentials

**Category**: productivity
**Service**: Bitwarden
**Base URL**: https://api.bitwarden.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bitwarden](https://integrations.do/bitwarden)

## Installation

```bash
npm install @dotdo/integration-bitwarden
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bitwarden
```

## Quick Start

```typescript
import { BitwardenClient } from '@dotdo/integration-bitwarden'

// Initialize client
const client = new BitwardenClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BitwardenClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bitwarden actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BitwardenError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BitwardenError) {
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
