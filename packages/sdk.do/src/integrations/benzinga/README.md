# Benzinga Integration

Benzinga provides real-time financial news and data APIs, offering comprehensive coverage of market-moving information for developers and financial professionals.

**Category**: productivity
**Service**: Benzinga
**Base URL**: https://api.benzinga.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/benzinga](https://integrations.do/benzinga)

## Installation

```bash
npm install @dotdo/integration-benzinga
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-benzinga
```

## Quick Start

```typescript
import { BenzingaClient } from '@dotdo/integration-benzinga'

// Initialize client
const client = new BenzingaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BenzingaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Benzinga actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BenzingaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BenzingaError) {
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
