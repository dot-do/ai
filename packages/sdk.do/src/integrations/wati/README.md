# Wati Integration

Wati is a WhatsApp Business API platform that automates marketing, sales, service, and support.

**Category**: productivity
**Service**: Wati
**Base URL**: https://api.wati.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/wati](https://integrations.do/wati)

## Installation

```bash
npm install @dotdo/integration-wati
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-wati
```

## Quick Start

```typescript
import { WatiClient } from '@dotdo/integration-wati'

// Initialize client
const client = new WatiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WatiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Wati actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WatiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WatiError) {
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
