# Agentql Integration

AgentQL is a suite of tools designed to connect AI agents to the web, enabling web interaction and structured data extraction through a specialized query language.

**Category**: productivity
**Service**: Agentql
**Base URL**: https://api.agentql.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/agentql](https://integrations.do/agentql)

## Installation

```bash
npm install @dotdo/integration-agentql
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-agentql
```

## Quick Start

```typescript
import { AgentqlClient } from '@dotdo/integration-agentql'

// Initialize client
const client = new AgentqlClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AgentqlClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Agentql actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AgentqlError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AgentqlError) {
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
