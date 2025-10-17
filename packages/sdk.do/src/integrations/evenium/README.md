# Evenium Integration

Evenium is an all-in-one event management platform that simplifies the planning, execution, and analysis of professional events.

**Category**: productivity
**Service**: Evenium
**Base URL**: https://api.evenium.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/evenium](https://integrations.do/evenium)

## Installation

```bash
npm install @dotdo/integration-evenium
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-evenium
```

## Quick Start

```typescript
import { EveniumClient } from '@dotdo/integration-evenium'

// Initialize client
const client = new EveniumClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EveniumClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Evenium actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EveniumError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EveniumError) {
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
