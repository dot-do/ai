# Teltel Integration

TelTel is a telecom operator and software provider offering tools for automated voice and SMS communication, including contact center software, Voice/SMS API, and VoIP/SIP trunking.

**Category**: productivity
**Service**: Teltel
**Base URL**: https://api.teltel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/teltel](https://integrations.do/teltel)

## Installation

```bash
npm install @dotdo/integration-teltel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-teltel
```

## Quick Start

```typescript
import { TeltelClient } from '@dotdo/integration-teltel'

// Initialize client
const client = new TeltelClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TeltelClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Teltel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TeltelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TeltelError) {
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
