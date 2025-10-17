# Wrike Integration

Wrike is a project management and collaboration tool offering customizable workflows, Gantt charts, reporting, and resource management to boost team productivity

**Category**: productivity
**Service**: Wrike
**Base URL**: https://api.wrike.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/wrike](https://integrations.do/wrike)

## Installation

```bash
npm install @dotdo/integration-wrike
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-wrike
```

## Quick Start

```typescript
import { WrikeClient } from '@dotdo/integration-wrike'

// Initialize client
const client = new WrikeClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new WrikeClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Wrike actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WrikeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WrikeError) {
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
