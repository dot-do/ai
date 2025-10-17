# Digicert Integration

DigiCert is a leading provider of high-assurance TLS/SSL, PKI, IoT, and signing solutions, enabling secure digital interactions worldwide.

**Category**: productivity
**Service**: Digicert
**Base URL**: https://api.digicert.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/digicert](https://integrations.do/digicert)

## Installation

```bash
npm install @dotdo/integration-digicert
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-digicert
```

## Quick Start

```typescript
import { DigicertClient } from '@dotdo/integration-digicert'

// Initialize client
const client = new DigicertClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DigicertClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Digicert actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DigicertError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DigicertError) {
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
