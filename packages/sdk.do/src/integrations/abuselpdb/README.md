# Abuselpdb Integration

AbuseIPDB is a project dedicated to helping make the internet safer by providing a central repository for reporting and checking IP addresses associated with malicious activities.

**Category**: productivity
**Service**: Abuselpdb
**Base URL**: https://api.abuselpdb.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/abuselpdb](https://integrations.do/abuselpdb)

## Installation

```bash
npm install @dotdo/integration-abuselpdb
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-abuselpdb
```

## Quick Start

```typescript
import { AbuselpdbClient } from '@dotdo/integration-abuselpdb'

// Initialize client
const client = new AbuselpdbClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AbuselpdbClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Abuselpdb actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AbuselpdbError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AbuselpdbError) {
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
