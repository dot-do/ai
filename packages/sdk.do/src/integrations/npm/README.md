# Npm Integration

npm is the default package manager for JavaScript and Node.js, facilitating the sharing and reuse of code, managing dependencies, and streamlining project workflows.

**Category**: productivity
**Service**: Npm
**Base URL**: https://api.npm.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/npm](https://integrations.do/npm)

## Installation

```bash
npm install @dotdo/integration-npm
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-npm
```

## Quick Start

```typescript
import { NpmClient } from '@dotdo/integration-npm'

// Initialize client
const client = new NpmClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NpmClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Npm actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NpmError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NpmError) {
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
