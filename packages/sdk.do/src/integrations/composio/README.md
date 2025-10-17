# Composio Integration

Composio enables AI Agents and LLMs to authenticate and integrate with various tools via function calling.

**Category**: developer-tools
**Service**: Composio
**Base URL**: https://api.composio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/composio](https://integrations.do/composio)

## Installation

```bash
npm install @dotdo/integration-composio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-composio
```

## Quick Start

```typescript
import { ComposioClient } from '@dotdo/integration-composio'

// Initialize client
const client = new ComposioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ComposioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Composio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ComposioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ComposioError) {
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
