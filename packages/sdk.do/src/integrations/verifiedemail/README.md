# Verifiedemail Integration

VerifiedEmail offers real-time email verification and bulk email list cleaning services to ensure the accuracy and deliverability of email communications.

**Category**: productivity
**Service**: Verifiedemail
**Base URL**: https://api.verifiedemail.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/verifiedemail](https://integrations.do/verifiedemail)

## Installation

```bash
npm install @dotdo/integration-verifiedemail
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-verifiedemail
```

## Quick Start

```typescript
import { VerifiedemailClient } from '@dotdo/integration-verifiedemail'

// Initialize client
const client = new VerifiedemailClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new VerifiedemailClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Verifiedemail actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `VerifiedemailError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof VerifiedemailError) {
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
