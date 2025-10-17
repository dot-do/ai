# Givebutter Integration

Givebutter is a fundraising platform that offers a free, open, and public API for developers to manage campaigns, track donations, and engage with supporters.

**Category**: productivity
**Service**: Givebutter
**Base URL**: https://api.givebutter.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/givebutter](https://integrations.do/givebutter)

## Installation

```bash
npm install @dotdo/integration-givebutter
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-givebutter
```

## Quick Start

```typescript
import { GivebutterClient } from '@dotdo/integration-givebutter'

// Initialize client
const client = new GivebutterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GivebutterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Givebutter actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GivebutterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GivebutterError) {
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
