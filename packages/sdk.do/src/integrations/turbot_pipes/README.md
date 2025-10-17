# Turbot pipes Integration

Turbot Pipes is an intelligence, automation, and security platform built specifically for DevOps, offering hosted Steampipe database instances, shared dashboards, snapshots, and more.

**Category**: productivity
**Service**: TurbotPipes
**Base URL**: https://api.turbot_pipes.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/turbot_pipes](https://integrations.do/turbot_pipes)

## Installation

```bash
npm install @dotdo/integration-turbot_pipes
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-turbot_pipes
```

## Quick Start

```typescript
import { TurbotPipesClient } from '@dotdo/integration-turbot_pipes'

// Initialize client
const client = new TurbotPipesClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TurbotPipesClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Turbot pipes actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TurbotPipesError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TurbotPipesError) {
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
