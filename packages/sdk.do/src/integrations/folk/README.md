# Folk Integration

folk is a next-generation CRM designed for teams to manage and nurture their relationships efficiently.

**Category**: crm
**Service**: Folk
**Base URL**: https://api.folk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/folk](https://integrations.do/folk)

## Installation

```bash
npm install @dotdo/integration-folk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-folk
```

## Quick Start

```typescript
import { FolkClient } from '@dotdo/integration-folk'

// Initialize client
const client = new FolkClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FolkClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Folk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FolkError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FolkError) {
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
