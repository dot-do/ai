# Eventzilla Integration

Eventzilla is an event management platform that provides tools for creating, promoting, and managing events, including ticketing, registration, and attendee management.

**Category**: productivity
**Service**: Eventzilla
**Base URL**: https://api.eventzilla.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/eventzilla](https://integrations.do/eventzilla)

## Installation

```bash
npm install @dotdo/integration-eventzilla
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-eventzilla
```

## Quick Start

```typescript
import { EventzillaClient } from '@dotdo/integration-eventzilla'

// Initialize client
const client = new EventzillaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EventzillaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Eventzilla actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EventzillaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EventzillaError) {
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
