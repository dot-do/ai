# Woodpecker co Integration

Woodpecker.co is a cold email tool that automates personalized email outreach and follow-ups for sales teams and agencies.

**Category**: productivity
**Service**: WoodpeckerCo
**Base URL**: https://api.woodpecker_co.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/woodpecker_co](https://integrations.do/woodpecker_co)

## Installation

```bash
npm install @dotdo/integration-woodpecker_co
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-woodpecker_co
```

## Quick Start

```typescript
import { WoodpeckerCoClient } from '@dotdo/integration-woodpecker_co'

// Initialize client
const client = new WoodpeckerCoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WoodpeckerCoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Woodpecker co actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WoodpeckerCoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WoodpeckerCoError) {
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
