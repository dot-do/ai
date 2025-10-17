# Tpscheck Integration

TPSCheck is a service that verifies in real-time if a phone number is registered with the UK's Telephone Preference Service (TPS) or Corporate Telephone Preference Service (CTPS), providing insights on validity, location, type, and provider of the number.

**Category**: productivity
**Service**: Tpscheck
**Base URL**: https://api.tpscheck.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tpscheck](https://integrations.do/tpscheck)

## Installation

```bash
npm install @dotdo/integration-tpscheck
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tpscheck
```

## Quick Start

```typescript
import { TpscheckClient } from '@dotdo/integration-tpscheck'

// Initialize client
const client = new TpscheckClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TpscheckClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Tpscheck actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TpscheckError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TpscheckError) {
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
