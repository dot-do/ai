# Emaillistverify Integration

EmailListVerify is a service that provides email verification and validation to ensure email lists are clean and deliverable.

**Category**: productivity
**Service**: Emaillistverify
**Base URL**: https://api.emaillistverify.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/emaillistverify](https://integrations.do/emaillistverify)

## Installation

```bash
npm install @dotdo/integration-emaillistverify
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-emaillistverify
```

## Quick Start

```typescript
import { EmaillistverifyClient } from '@dotdo/integration-emaillistverify'

// Initialize client
const client = new EmaillistverifyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EmaillistverifyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Emaillistverify actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EmaillistverifyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EmaillistverifyError) {
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
