# Chmeetings Integration

ChMeetings is a church management solution assisting with event planning, member engagement, donations tracking, and volunteer coordination for faith-based organizations

**Category**: productivity
**Service**: Chmeetings
**Base URL**: https://api.chmeetings.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/chmeetings](https://integrations.do/chmeetings)

## Installation

```bash
npm install @dotdo/integration-chmeetings
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-chmeetings
```

## Quick Start

```typescript
import { ChmeetingsClient } from '@dotdo/integration-chmeetings'

// Initialize client
const client = new ChmeetingsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ChmeetingsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Chmeetings actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ChmeetingsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ChmeetingsError) {
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
