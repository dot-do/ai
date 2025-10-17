# Buildkite Integration

Buildkite is a platform for running fast, secure, and scalable continuous integration pipelines on your own infrastructure.

**Category**: productivity
**Service**: Buildkite
**Base URL**: https://api.buildkite.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/buildkite](https://integrations.do/buildkite)

## Installation

```bash
npm install @dotdo/integration-buildkite
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-buildkite
```

## Quick Start

```typescript
import { BuildkiteClient } from '@dotdo/integration-buildkite'

// Initialize client
const client = new BuildkiteClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BuildkiteClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Buildkite actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BuildkiteError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BuildkiteError) {
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
