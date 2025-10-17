# Sevdesk Integration

sevDesk is an online accounting software designed for small businesses and freelancers, offering features like invoicing, expense management, and financial reporting.

**Category**: productivity
**Service**: Sevdesk
**Base URL**: https://api.sevdesk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sevdesk](https://integrations.do/sevdesk)

## Installation

```bash
npm install @dotdo/integration-sevdesk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sevdesk
```

## Quick Start

```typescript
import { SevdeskClient } from '@dotdo/integration-sevdesk'

// Initialize client
const client = new SevdeskClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SevdeskClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sevdesk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SevdeskError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SevdeskError) {
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
