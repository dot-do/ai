# Corrently Integration

Corrently provides a suite of APIs offering real-time and forecasted data on renewable energy availability, CO₂ emissions, and electricity pricing, enabling users to optimize energy consumption and reduce carbon footprints.

**Category**: productivity
**Service**: Corrently
**Base URL**: https://api.corrently.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/corrently](https://integrations.do/corrently)

## Installation

```bash
npm install @dotdo/integration-corrently
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-corrently
```

## Quick Start

```typescript
import { CorrentlyClient } from '@dotdo/integration-corrently'

// Initialize client
const client = new CorrentlyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CorrentlyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Corrently actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CorrentlyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CorrentlyError) {
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
