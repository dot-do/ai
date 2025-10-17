# Btcpay server Integration

BTCPay Server is a free, open-source, self-hosted Bitcoin payment processor that enables merchants to accept Bitcoin payments without intermediaries.

**Category**: productivity
**Service**: BtcpayServer
**Base URL**: https://api.btcpay_server.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/btcpay_server](https://integrations.do/btcpay_server)

## Installation

```bash
npm install @dotdo/integration-btcpay_server
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-btcpay_server
```

## Quick Start

```typescript
import { BtcpayServerClient } from '@dotdo/integration-btcpay_server'

// Initialize client
const client = new BtcpayServerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BtcpayServerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Btcpay server actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BtcpayServerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BtcpayServerError) {
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
