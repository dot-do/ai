# Nocrm io Integration

noCRM.io is a lead management software designed to help sales teams track and close deals efficiently.

**Category**: crm
**Service**: NocrmIo
**Base URL**: https://api.nocrm_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/nocrm_io](https://integrations.do/nocrm_io)

## Installation

```bash
npm install @dotdo/integration-nocrm_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-nocrm_io
```

## Quick Start

```typescript
import { NocrmIoClient } from '@dotdo/integration-nocrm_io'

// Initialize client
const client = new NocrmIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NocrmIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Nocrm io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NocrmIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NocrmIoError) {
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
