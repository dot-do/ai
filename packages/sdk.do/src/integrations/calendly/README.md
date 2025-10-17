# Calendly Integration

Calendly is an appointment scheduling tool that automates meeting invitations, availability checks, and reminders, helping individuals and teams avoid email back-and-forth

**Category**: productivity
**Service**: Calendly
**Base URL**: https://api.calendly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/calendly](https://integrations.do/calendly)

## Installation

```bash
npm install @dotdo/integration-calendly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-calendly
```

## Quick Start

```typescript
import { CalendlyClient } from '@dotdo/integration-calendly'

// Initialize client
const client = new CalendlyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new CalendlyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Calendly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CalendlyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CalendlyError) {
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
