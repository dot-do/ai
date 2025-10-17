# Unione Integration

UniOne is an email delivery service offering a versatile Web API and SMTP API for sending transactional and marketing emails.

**Category**: productivity
**Service**: Unione
**Base URL**: https://api.unione.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/unione](https://integrations.do/unione)

## Installation

```bash
npm install @dotdo/integration-unione
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-unione
```

## Quick Start

```typescript
import { UnioneClient } from '@dotdo/integration-unione'

// Initialize client
const client = new UnioneClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new UnioneClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Unione actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `UnioneError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof UnioneError) {
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
