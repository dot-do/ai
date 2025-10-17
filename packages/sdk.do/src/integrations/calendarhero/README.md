# Calendarhero Integration

CalendarHero is a versatile scheduling tool designed to streamline and simplify your calendar management. It integrates seamlessly with your existing calendars, allowing you to efficiently schedule, reschedule, and manage meetings with ease.

**Category**: productivity
**Service**: Calendarhero
**Base URL**: https://api.calendarhero.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/calendarhero](https://integrations.do/calendarhero)

## Installation

```bash
npm install @dotdo/integration-calendarhero
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-calendarhero
```

## Quick Start

```typescript
import { CalendarheroClient } from '@dotdo/integration-calendarhero'

// Initialize client
const client = new CalendarheroClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CalendarheroClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Calendarhero actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CalendarheroError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CalendarheroError) {
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
