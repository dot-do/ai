# Formcarry Integration

Formcarry is a form API that allows you to collect submissions from your own designed HTML forms without coding any backend, providing features like email notifications, file uploads, spam protection, and integrations with other apps.

**Category**: productivity
**Service**: Formcarry
**Base URL**: https://api.formcarry.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/formcarry](https://integrations.do/formcarry)

## Installation

```bash
npm install @dotdo/integration-formcarry
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-formcarry
```

## Quick Start

```typescript
import { FormcarryClient } from '@dotdo/integration-formcarry'

// Initialize client
const client = new FormcarryClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FormcarryClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Formcarry actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FormcarryError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FormcarryError) {
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
