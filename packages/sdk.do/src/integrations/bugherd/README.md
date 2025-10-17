# Bugherd Integration

BugHerd is a visual feedback and bug tracking tool for websites, allowing clients and teams to report issues directly on live sites.

**Category**: productivity
**Service**: Bugherd
**Base URL**: https://api.bugherd.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bugherd](https://integrations.do/bugherd)

## Installation

```bash
npm install @dotdo/integration-bugherd
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bugherd
```

## Quick Start

```typescript
import { BugherdClient } from '@dotdo/integration-bugherd'

// Initialize client
const client = new BugherdClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BugherdClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bugherd actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BugherdError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BugherdError) {
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
