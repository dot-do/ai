# Bookingmood Integration

Bookingmood provides flexible, commission-free booking software for rental businesses of all sizes, enabling seamless integration with your website.

**Category**: productivity
**Service**: Bookingmood
**Base URL**: https://api.bookingmood.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bookingmood](https://integrations.do/bookingmood)

## Installation

```bash
npm install @dotdo/integration-bookingmood
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bookingmood
```

## Quick Start

```typescript
import { BookingmoodClient } from '@dotdo/integration-bookingmood'

// Initialize client
const client = new BookingmoodClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BookingmoodClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bookingmood actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BookingmoodError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BookingmoodError) {
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
