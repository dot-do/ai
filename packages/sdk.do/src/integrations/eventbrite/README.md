# Eventbrite Integration

Eventbrite enables organizers to plan, promote, and manage events, selling tickets and providing attendee tools for conferences, concerts, and gatherings

**Category**: marketing
**Service**: Eventbrite
**Base URL**: https://api.eventbrite.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/eventbrite](https://integrations.do/eventbrite)

## Installation

```bash
npm install @dotdo/integration-eventbrite
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-eventbrite
```

## Quick Start

```typescript
import { EventbriteClient } from '@dotdo/integration-eventbrite'

// Initialize client
const client = new EventbriteClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new EventbriteClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Eventbrite actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EventbriteError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EventbriteError) {
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
