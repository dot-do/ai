# Ticketmaster Integration

Ticketmaster provides APIs for event discovery, inventory management, and ticketing solutions.

**Category**: productivity
**Service**: Ticketmaster
**Base URL**: https://api.ticketmaster.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ticketmaster](https://integrations.do/ticketmaster)

## Installation

```bash
npm install @dotdo/integration-ticketmaster
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ticketmaster
```

## Quick Start

```typescript
import { TicketmasterClient } from '@dotdo/integration-ticketmaster'

// Initialize client
const client = new TicketmasterClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new TicketmasterClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Ticketmaster actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TicketmasterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TicketmasterError) {
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
