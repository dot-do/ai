# Leiga Integration

Leiga is an AI-powered project management tool that automates tasks and enhances team collaboration.

**Category**: productivity
**Service**: Leiga
**Base URL**: https://api.leiga.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/leiga](https://integrations.do/leiga)

## Installation

```bash
npm install @dotdo/integration-leiga
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-leiga
```

## Quick Start

```typescript
import { LeigaClient } from '@dotdo/integration-leiga'

// Initialize client
const client = new LeigaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LeigaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Leiga actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LeigaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LeigaError) {
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
