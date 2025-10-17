# Dnsfilter Integration

DNSFilter provides cloud-based DNS security and content filtering solutions to protect networks from online threats and manage internet usage.

**Category**: productivity
**Service**: Dnsfilter
**Base URL**: https://api.dnsfilter.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dnsfilter](https://integrations.do/dnsfilter)

## Installation

```bash
npm install @dotdo/integration-dnsfilter
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dnsfilter
```

## Quick Start

```typescript
import { DnsfilterClient } from '@dotdo/integration-dnsfilter'

// Initialize client
const client = new DnsfilterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DnsfilterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dnsfilter actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DnsfilterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DnsfilterError) {
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
