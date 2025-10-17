# Lever sandbox Integration

Lever Sandbox is a test environment for Lever's ATS, allowing organizations to experiment with configurations, workflows, and integrations without affecting production data

**Category**: hr
**Service**: LeverSandbox
**Base URL**: https://api.lever_sandbox.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/lever_sandbox](https://integrations.do/lever_sandbox)

## Installation

```bash
npm install @dotdo/integration-lever_sandbox
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-lever_sandbox
```

## Quick Start

```typescript
import { LeverSandboxClient } from '@dotdo/integration-lever_sandbox'

// Initialize client
const client = new LeverSandboxClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new LeverSandboxClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Lever sandbox actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LeverSandboxError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LeverSandboxError) {
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
