# Fingertip Integration

Fingertip is an all-in-one platform that enables businesses to manage their operations from a single link, offering tools for selling products, booking clients, and connecting with customers across various social media platforms.

**Category**: productivity
**Service**: Fingertip
**Base URL**: https://api.fingertip.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/fingertip](https://integrations.do/fingertip)

## Installation

```bash
npm install @dotdo/integration-fingertip
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-fingertip
```

## Quick Start

```typescript
import { FingertipClient } from '@dotdo/integration-fingertip'

// Initialize client
const client = new FingertipClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FingertipClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Fingertip actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FingertipError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FingertipError) {
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
