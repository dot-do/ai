# Page x Integration

PAGE X is a CRM solution that enables businesses to drive sales, track leads, automate tasks, and enhance service efficiency.

**Category**: crm
**Service**: PageX
**Base URL**: https://api.page_x.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/page_x](https://integrations.do/page_x)

## Installation

```bash
npm install @dotdo/integration-page_x
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-page_x
```

## Quick Start

```typescript
import { PageXClient } from '@dotdo/integration-page_x'

// Initialize client
const client = new PageXClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PageXClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Page x actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PageXError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PageXError) {
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
