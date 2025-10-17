# Smartproxy Integration

Smartproxy offers a comprehensive suite of proxy and web scraping solutions, providing users with access to a vast network of residential, datacenter, ISP, and mobile proxies, along with scraping APIs for efficient data collection.

**Category**: productivity
**Service**: Smartproxy
**Base URL**: https://api.smartproxy.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/smartproxy](https://integrations.do/smartproxy)

## Installation

```bash
npm install @dotdo/integration-smartproxy
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-smartproxy
```

## Quick Start

```typescript
import { SmartproxyClient } from '@dotdo/integration-smartproxy'

// Initialize client
const client = new SmartproxyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SmartproxyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Smartproxy actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SmartproxyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SmartproxyError) {
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
