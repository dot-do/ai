# Proxiedmail Integration

ProxiedMail offers privacy-focused email services, including automatic creation of proxy emails and receiving emails via webhooks.

**Category**: productivity
**Service**: Proxiedmail
**Base URL**: https://api.proxiedmail.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/proxiedmail](https://integrations.do/proxiedmail)

## Installation

```bash
npm install @dotdo/integration-proxiedmail
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-proxiedmail
```

## Quick Start

```typescript
import { ProxiedmailClient } from '@dotdo/integration-proxiedmail'

// Initialize client
const client = new ProxiedmailClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ProxiedmailClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Proxiedmail actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ProxiedmailError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ProxiedmailError) {
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
