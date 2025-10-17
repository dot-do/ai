# Intelliprint Integration

Intelliprint offers a Hybrid Mail API that enables businesses to automate their letter printing and mailing processes, providing features like same-day printing, secure authentication, and real-time tracking.

**Category**: productivity
**Service**: Intelliprint
**Base URL**: https://api.intelliprint.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/intelliprint](https://integrations.do/intelliprint)

## Installation

```bash
npm install @dotdo/integration-intelliprint
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-intelliprint
```

## Quick Start

```typescript
import { IntelliprintClient } from '@dotdo/integration-intelliprint'

// Initialize client
const client = new IntelliprintClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new IntelliprintClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Intelliprint actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `IntelliprintError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof IntelliprintError) {
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
