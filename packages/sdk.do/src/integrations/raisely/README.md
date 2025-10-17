# Raisely Integration

Raisely is a fundraising platform that enables organizations to create and manage online fundraising campaigns.

**Category**: productivity
**Service**: Raisely
**Base URL**: https://api.raisely.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/raisely](https://integrations.do/raisely)

## Installation

```bash
npm install @dotdo/integration-raisely
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-raisely
```

## Quick Start

```typescript
import { RaiselyClient } from '@dotdo/integration-raisely'

// Initialize client
const client = new RaiselyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RaiselyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Raisely actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RaiselyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RaiselyError) {
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
