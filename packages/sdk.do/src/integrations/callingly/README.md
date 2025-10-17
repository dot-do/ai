# Callingly Integration

Callingly is a lead response management software that automates immediate call and text follow-ups to new leads, integrating seamlessly with various CRMs and lead sources to enhance sales team responsiveness and conversion rates.

**Category**: productivity
**Service**: Callingly
**Base URL**: https://api.callingly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/callingly](https://integrations.do/callingly)

## Installation

```bash
npm install @dotdo/integration-callingly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-callingly
```

## Quick Start

```typescript
import { CallinglyClient } from '@dotdo/integration-callingly'

// Initialize client
const client = new CallinglyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CallinglyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Callingly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CallinglyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CallinglyError) {
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
