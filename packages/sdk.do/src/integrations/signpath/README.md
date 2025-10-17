# Signpath Integration

SignPath is a code signing service that integrates with your build system to automate the signing of your software artifacts, ensuring their authenticity and integrity.

**Category**: productivity
**Service**: Signpath
**Base URL**: https://api.signpath.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/signpath](https://integrations.do/signpath)

## Installation

```bash
npm install @dotdo/integration-signpath
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-signpath
```

## Quick Start

```typescript
import { SignpathClient } from '@dotdo/integration-signpath'

// Initialize client
const client = new SignpathClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SignpathClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Signpath actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SignpathError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SignpathError) {
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
