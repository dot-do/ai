# Freshdesk Integration

Freshdesk provides customer support software with ticketing, knowledge base, and automation features for efficient helpdesk operations and better customer experiences

**Category**: crm
**Service**: Freshdesk
**Base URL**: https://api.freshdesk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/freshdesk](https://integrations.do/freshdesk)

## Installation

```bash
npm install @dotdo/integration-freshdesk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-freshdesk
```

## Quick Start

```typescript
import { FreshdeskClient } from '@dotdo/integration-freshdesk'

// Initialize client
const client = new FreshdeskClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new FreshdeskClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Freshdesk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FreshdeskError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FreshdeskError) {
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
