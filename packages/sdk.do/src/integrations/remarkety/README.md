# Remarkety Integration

Remarkety is an AI-powered marketing automation platform designed for eCommerce, enabling personalized email, SMS, and social campaigns based on customer behavior.

**Category**: productivity
**Service**: Remarkety
**Base URL**: https://api.remarkety.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/remarkety](https://integrations.do/remarkety)

## Installation

```bash
npm install @dotdo/integration-remarkety
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-remarkety
```

## Quick Start

```typescript
import { RemarketyClient } from '@dotdo/integration-remarkety'

// Initialize client
const client = new RemarketyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RemarketyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Remarkety actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RemarketyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RemarketyError) {
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
