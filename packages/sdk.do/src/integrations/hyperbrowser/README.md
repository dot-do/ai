# Hyperbrowser Integration

Hyperbrowser is a next-generation platform empowering AI agents and enabling effortless, scalable browser automation.

**Category**: productivity
**Service**: Hyperbrowser
**Base URL**: https://api.hyperbrowser.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/hyperbrowser](https://integrations.do/hyperbrowser)

## Installation

```bash
npm install @dotdo/integration-hyperbrowser
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-hyperbrowser
```

## Quick Start

```typescript
import { HyperbrowserClient } from '@dotdo/integration-hyperbrowser'

// Initialize client
const client = new HyperbrowserClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HyperbrowserClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Hyperbrowser actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HyperbrowserError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HyperbrowserError) {
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
