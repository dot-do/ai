# Timekit Integration

Timekit is a scheduling infrastructure for businesses, offering booking workflows, calendar integrations, and automation of appointment handling through an API-first approach

**Category**: productivity
**Service**: Timekit
**Base URL**: https://api.timekit.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/timekit](https://integrations.do/timekit)

## Installation

```bash
npm install @dotdo/integration-timekit
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-timekit
```

## Quick Start

```typescript
import { TimekitClient } from '@dotdo/integration-timekit'

// Initialize client
const client = new TimekitClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TimekitClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Timekit actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TimekitError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TimekitError) {
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
