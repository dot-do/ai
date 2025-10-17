# Axonaut Integration

Axonaut is an integrated business management platform combining finance, invoicing, and CRM, enabling SMEs to handle accounting, client relations, and administrative tasks in one environment

**Category**: accounting
**Service**: Axonaut
**Base URL**: https://api.axonaut.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/axonaut](https://integrations.do/axonaut)

## Installation

```bash
npm install @dotdo/integration-axonaut
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-axonaut
```

## Quick Start

```typescript
import { AxonautClient } from '@dotdo/integration-axonaut'

// Initialize client
const client = new AxonautClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AxonautClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Axonaut actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AxonautError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AxonautError) {
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
