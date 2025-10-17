# Chaser Integration

Chaser is an accounts receivable automation software that helps businesses automate invoice reminders and get paid faster.

**Category**: productivity
**Service**: Chaser
**Base URL**: https://api.chaser.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/chaser](https://integrations.do/chaser)

## Installation

```bash
npm install @dotdo/integration-chaser
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-chaser
```

## Quick Start

```typescript
import { ChaserClient } from '@dotdo/integration-chaser'

// Initialize client
const client = new ChaserClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ChaserClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Chaser actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ChaserError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ChaserError) {
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
