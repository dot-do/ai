# Nextdns Integration

NextDNS is a DNS service that enhances internet security and privacy by blocking malicious websites, tracking scripts, and ads before they reach your device.

**Category**: productivity
**Service**: Nextdns
**Base URL**: https://api.nextdns.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/nextdns](https://integrations.do/nextdns)

## Installation

```bash
npm install @dotdo/integration-nextdns
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-nextdns
```

## Quick Start

```typescript
import { NextdnsClient } from '@dotdo/integration-nextdns'

// Initialize client
const client = new NextdnsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NextdnsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Nextdns actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NextdnsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NextdnsError) {
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
