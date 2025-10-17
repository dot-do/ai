# Anthropic administrator Integration

The Anthropic Admin API allows programmatic management of organizational resources, including members, workspaces, and API keys.

**Category**: productivity
**Service**: AnthropicAdministrator
**Base URL**: https://api.anthropic_administrator.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/anthropic_administrator](https://integrations.do/anthropic_administrator)

## Installation

```bash
npm install @dotdo/integration-anthropic_administrator
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-anthropic_administrator
```

## Quick Start

```typescript
import { AnthropicAdministratorClient } from '@dotdo/integration-anthropic_administrator'

// Initialize client
const client = new AnthropicAdministratorClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AnthropicAdministratorClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Anthropic administrator actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AnthropicAdministratorError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AnthropicAdministratorError) {
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
