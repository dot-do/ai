# Desktime Integration

DeskTime is an automatic time tracking software that helps teams and freelancers monitor productivity, manage projects, and analyze work habits.

**Category**: productivity
**Service**: Desktime
**Base URL**: https://api.desktime.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/desktime](https://integrations.do/desktime)

## Installation

```bash
npm install @dotdo/integration-desktime
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-desktime
```

## Quick Start

```typescript
import { DesktimeClient } from '@dotdo/integration-desktime'

// Initialize client
const client = new DesktimeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DesktimeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Desktime actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DesktimeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DesktimeError) {
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
