# Helcim Integration

Helcim delivers payment processing, merchant accounts, and point-of-sale solutions, empowering businesses to manage transactions and financial operations with transparent pricing

**Category**: accounting
**Service**: Helcim
**Base URL**: https://api.helcim.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/helcim](https://integrations.do/helcim)

## Installation

```bash
npm install @dotdo/integration-helcim
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-helcim
```

## Quick Start

```typescript
import { HelcimClient } from '@dotdo/integration-helcim'

// Initialize client
const client = new HelcimClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HelcimClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Helcim actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HelcimError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HelcimError) {
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
