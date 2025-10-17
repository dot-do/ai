# Retently Integration

Retently is a customer experience management platform that enables businesses to collect, analyze, and act on customer feedback through surveys and integrations.

**Category**: productivity
**Service**: Retently
**Base URL**: https://api.retently.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/retently](https://integrations.do/retently)

## Installation

```bash
npm install @dotdo/integration-retently
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-retently
```

## Quick Start

```typescript
import { RetentlyClient } from '@dotdo/integration-retently'

// Initialize client
const client = new RetentlyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RetentlyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Retently actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RetentlyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RetentlyError) {
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
