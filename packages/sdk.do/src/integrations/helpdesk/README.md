# Helpdesk Integration

HelpDesk is a ticketing system designed to streamline customer support by organizing and managing inquiries efficiently.

**Category**: productivity
**Service**: Helpdesk
**Base URL**: https://api.helpdesk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/helpdesk](https://integrations.do/helpdesk)

## Installation

```bash
npm install @dotdo/integration-helpdesk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-helpdesk
```

## Quick Start

```typescript
import { HelpdeskClient } from '@dotdo/integration-helpdesk'

// Initialize client
const client = new HelpdeskClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HelpdeskClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Helpdesk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HelpdeskError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HelpdeskError) {
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
