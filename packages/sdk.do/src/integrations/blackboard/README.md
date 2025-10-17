# Blackboard Integration

Anthology Adopt powered by Pendo allows institutions to gain insights on Blackboard Learn usage and take action through in-app messages, digital walkthrough guides, and tooltips.

**Category**: productivity
**Service**: Blackboard
**Base URL**: https://api.blackboard.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/blackboard](https://integrations.do/blackboard)

## Installation

```bash
npm install @dotdo/integration-blackboard
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-blackboard
```

## Quick Start

```typescript
import { BlackboardClient } from '@dotdo/integration-blackboard'

// Initialize client
const client = new BlackboardClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BlackboardClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Blackboard actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BlackboardError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BlackboardError) {
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
