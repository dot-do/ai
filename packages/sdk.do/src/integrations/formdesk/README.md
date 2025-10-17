# Formdesk Integration

Formdesk is an online form builder that allows users to create and manage professional online forms with flexible features and integrations.

**Category**: productivity
**Service**: Formdesk
**Base URL**: https://api.formdesk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/formdesk](https://integrations.do/formdesk)

## Installation

```bash
npm install @dotdo/integration-formdesk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-formdesk
```

## Quick Start

```typescript
import { FormdeskClient } from '@dotdo/integration-formdesk'

// Initialize client
const client = new FormdeskClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FormdeskClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Formdesk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FormdeskError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FormdeskError) {
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
