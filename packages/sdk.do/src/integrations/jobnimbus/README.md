# Jobnimbus Integration

JobNimbus is a CRM and project management software designed for contractors, helping streamline scheduling, estimates, invoicing, and job tracking.

**Category**: crm
**Service**: Jobnimbus
**Base URL**: https://api.jobnimbus.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/jobnimbus](https://integrations.do/jobnimbus)

## Installation

```bash
npm install @dotdo/integration-jobnimbus
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-jobnimbus
```

## Quick Start

```typescript
import { JobnimbusClient } from '@dotdo/integration-jobnimbus'

// Initialize client
const client = new JobnimbusClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new JobnimbusClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Jobnimbus actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `JobnimbusError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof JobnimbusError) {
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
