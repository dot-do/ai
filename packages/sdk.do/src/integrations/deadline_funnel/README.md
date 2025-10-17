# Deadline funnel Integration

Deadline Funnel provides tools to create authentic, personalized deadlines for marketing campaigns, enhancing urgency and conversions.

**Category**: productivity
**Service**: DeadlineFunnel
**Base URL**: https://api.deadline_funnel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/deadline_funnel](https://integrations.do/deadline_funnel)

## Installation

```bash
npm install @dotdo/integration-deadline_funnel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-deadline_funnel
```

## Quick Start

```typescript
import { DeadlineFunnelClient } from '@dotdo/integration-deadline_funnel'

// Initialize client
const client = new DeadlineFunnelClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DeadlineFunnelClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Deadline funnel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DeadlineFunnelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DeadlineFunnelError) {
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
