# Bouncer Integration

Bouncer is an email verification and validation service that helps ensure email deliverability by verifying email addresses through real-time and batch processing APIs.

**Category**: productivity
**Service**: Bouncer
**Base URL**: https://api.bouncer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bouncer](https://integrations.do/bouncer)

## Installation

```bash
npm install @dotdo/integration-bouncer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bouncer
```

## Quick Start

```typescript
import { BouncerClient } from '@dotdo/integration-bouncer'

// Initialize client
const client = new BouncerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BouncerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bouncer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BouncerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BouncerError) {
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
