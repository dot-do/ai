# Clickup Integration

ClickUp unifies tasks, docs, goals, and chat in a single platform, allowing teams to plan, organize, and collaborate across projects with customizable workflows

**Category**: productivity
**Service**: Clickup
**Base URL**: https://api.clickup.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/clickup](https://integrations.do/clickup)

## Installation

```bash
npm install @dotdo/integration-clickup
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-clickup
```

## Quick Start

```typescript
import { ClickupClient } from '@dotdo/integration-clickup'

// Initialize client
const client = new ClickupClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ClickupClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Clickup actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ClickupError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ClickupError) {
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
