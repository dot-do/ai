# Terminus Integration

Terminus is a data-driven platform offering project oversight, campaign coordination, and analytics to help teams unify tasks, measure impact, and leverage insights

**Category**: productivity
**Service**: Terminus
**Base URL**: https://api.terminus.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/terminus](https://integrations.do/terminus)

## Installation

```bash
npm install @dotdo/integration-terminus
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-terminus
```

## Quick Start

```typescript
import { TerminusClient } from '@dotdo/integration-terminus'

// Initialize client
const client = new TerminusClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new TerminusClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Terminus actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TerminusError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TerminusError) {
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
