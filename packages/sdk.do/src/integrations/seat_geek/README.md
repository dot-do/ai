# Seat geek Integration

SeatGeek Platform API provides access to events, venues, and performers data for concerts, sports, theater, and other live entertainment

**Category**: productivity
**Service**: SeatGeek
**Base URL**: https://api.seat_geek.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/seat_geek](https://integrations.do/seat_geek)

## Installation

```bash
npm install @dotdo/integration-seat_geek
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-seat_geek
```

## Quick Start

```typescript
import { SeatGeekClient } from '@dotdo/integration-seat_geek'

// Initialize client
const client = new SeatGeekClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SeatGeekClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Seat geek actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SeatGeekError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SeatGeekError) {
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
