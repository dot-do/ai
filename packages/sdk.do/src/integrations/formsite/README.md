# Formsite Integration

Formsite helps users create online forms and surveys with drag-and-drop tools, secure data capture, and integrations to simplify workflows

**Category**: productivity
**Service**: Formsite
**Base URL**: https://api.formsite.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/formsite](https://integrations.do/formsite)

## Installation

```bash
npm install @dotdo/integration-formsite
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-formsite
```

## Quick Start

```typescript
import { FormsiteClient } from '@dotdo/integration-formsite'

// Initialize client
const client = new FormsiteClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FormsiteClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Formsite actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FormsiteError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FormsiteError) {
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
