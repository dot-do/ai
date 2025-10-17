# Async interview Integration

Async Interview is an on-demand video interview platform that streamlines the hiring process by allowing candidates to respond to pre-recorded questions at their convenience, enabling employers to review responses asynchronously.

**Category**: productivity
**Service**: AsyncInterview
**Base URL**: https://api.async_interview.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/async_interview](https://integrations.do/async_interview)

## Installation

```bash
npm install @dotdo/integration-async_interview
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-async_interview
```

## Quick Start

```typescript
import { AsyncInterviewClient } from '@dotdo/integration-async_interview'

// Initialize client
const client = new AsyncInterviewClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AsyncInterviewClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Async interview actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AsyncInterviewError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AsyncInterviewError) {
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
