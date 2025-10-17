# Salesmate Integration

Salesmate is an AI-powered CRM platform designed to help businesses engage leads, close deals faster, nurture relationships, and provide seamless support through a unified, intuitive interface.

**Category**: crm
**Service**: Salesmate
**Base URL**: https://api.salesmate.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/salesmate](https://integrations.do/salesmate)

## Installation

```bash
npm install @dotdo/integration-salesmate
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-salesmate
```

## Quick Start

```typescript
import { SalesmateClient } from '@dotdo/integration-salesmate'

// Initialize client
const client = new SalesmateClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SalesmateClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Salesmate actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SalesmateError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SalesmateError) {
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
