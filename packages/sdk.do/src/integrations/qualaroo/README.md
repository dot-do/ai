# Qualaroo Integration

Qualaroo offers on-site surveys and user feedback tools, helping businesses understand visitor behavior, gather insights, and optimize customer experiences

**Category**: crm
**Service**: Qualaroo
**Base URL**: https://api.qualaroo.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/qualaroo](https://integrations.do/qualaroo)

## Installation

```bash
npm install @dotdo/integration-qualaroo
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-qualaroo
```

## Quick Start

```typescript
import { QualarooClient } from '@dotdo/integration-qualaroo'

// Initialize client
const client = new QualarooClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new QualarooClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Qualaroo actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `QualarooError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof QualarooError) {
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
