# Rootly Integration

Rootly is an AI-native incident management platform that automates workflows and collaboration, integrating with Slack, PagerDuty, and other tools to streamline incident response.

**Category**: productivity
**Service**: Rootly
**Base URL**: https://api.rootly.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/rootly](https://integrations.do/rootly)

## Installation

```bash
npm install @dotdo/integration-rootly
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-rootly
```

## Quick Start

```typescript
import { RootlyClient } from '@dotdo/integration-rootly'

// Initialize client
const client = new RootlyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RootlyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Rootly actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RootlyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RootlyError) {
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
