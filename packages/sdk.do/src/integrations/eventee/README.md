# Eventee Integration

Eventee is an intuitive mobile and web app that enhances attendee experience and engagement at in-person, virtual, or hybrid events.

**Category**: productivity
**Service**: Eventee
**Base URL**: https://api.eventee.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/eventee](https://integrations.do/eventee)

## Installation

```bash
npm install @dotdo/integration-eventee
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-eventee
```

## Quick Start

```typescript
import { EventeeClient } from '@dotdo/integration-eventee'

// Initialize client
const client = new EventeeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EventeeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Eventee actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EventeeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EventeeError) {
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
