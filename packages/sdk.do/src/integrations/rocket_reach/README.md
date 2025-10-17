# Rocket reach Integration

RocketReach locates and verifies professional contact details, helping sales and recruiters reach leads and candidates more efficiently

**Category**: crm
**Service**: RocketReach
**Base URL**: https://api.rocket_reach.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/rocket_reach](https://integrations.do/rocket_reach)

## Installation

```bash
npm install @dotdo/integration-rocket_reach
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-rocket_reach
```

## Quick Start

```typescript
import { RocketReachClient } from '@dotdo/integration-rocket_reach'

// Initialize client
const client = new RocketReachClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RocketReachClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Rocket reach actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RocketReachError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RocketReachError) {
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
