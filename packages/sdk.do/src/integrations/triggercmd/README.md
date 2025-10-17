# Triggercmd Integration

TRIGGERcmd is a cloud service that allows you to securely and remotely run commands on your computers.

**Category**: productivity
**Service**: Triggercmd
**Base URL**: https://api.triggercmd.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/triggercmd](https://integrations.do/triggercmd)

## Installation

```bash
npm install @dotdo/integration-triggercmd
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-triggercmd
```

## Quick Start

```typescript
import { TriggercmdClient } from '@dotdo/integration-triggercmd'

// Initialize client
const client = new TriggercmdClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TriggercmdClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Triggercmd actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TriggercmdError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TriggercmdError) {
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
