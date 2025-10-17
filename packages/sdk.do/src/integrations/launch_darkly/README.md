# Launch darkly Integration

A feature management platform that helps teams build better software faster using feature flags.

**Category**: productivity
**Service**: LaunchDarkly
**Base URL**: https://api.launch_darkly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/launch_darkly](https://integrations.do/launch_darkly)

## Installation

```bash
npm install @dotdo/integration-launch_darkly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-launch_darkly
```

## Quick Start

```typescript
import { LaunchDarklyClient } from '@dotdo/integration-launch_darkly'

// Initialize client
const client = new LaunchDarklyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LaunchDarklyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Launch darkly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LaunchDarklyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LaunchDarklyError) {
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
