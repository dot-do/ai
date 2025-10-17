# Altoviz Integration

Altoviz is a cloud-based billing and invoicing platform for businesses, offering online payments, expense tracking, document management, and customizable invoices.

**Category**: productivity
**Service**: Altoviz
**Base URL**: https://api.altoviz.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/altoviz](https://integrations.do/altoviz)

## Installation

```bash
npm install @dotdo/integration-altoviz
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-altoviz
```

## Quick Start

```typescript
import { AltovizClient } from '@dotdo/integration-altoviz'

// Initialize client
const client = new AltovizClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AltovizClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Altoviz actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AltovizError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AltovizError) {
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
