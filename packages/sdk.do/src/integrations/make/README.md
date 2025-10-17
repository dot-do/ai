# Make Integration

Make is a platform that allows users to automate workflows by connecting various apps and services.

**Category**: productivity
**Service**: Make
**Base URL**: https://api.make.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/make](https://integrations.do/make)

## Installation

```bash
npm install @dotdo/integration-make
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-make
```

## Quick Start

```typescript
import { MakeClient } from '@dotdo/integration-make'

// Initialize client
const client = new MakeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MakeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Make actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MakeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MakeError) {
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
