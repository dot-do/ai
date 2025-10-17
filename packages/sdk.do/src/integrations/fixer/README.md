# Fixer Integration

Fixer is a currency data API providing real-time and historical exchange rates for 170 world currencies.

**Category**: productivity
**Service**: Fixer
**Base URL**: https://api.fixer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/fixer](https://integrations.do/fixer)

## Installation

```bash
npm install @dotdo/integration-fixer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-fixer
```

## Quick Start

```typescript
import { FixerClient } from '@dotdo/integration-fixer'

// Initialize client
const client = new FixerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FixerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Fixer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FixerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FixerError) {
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
