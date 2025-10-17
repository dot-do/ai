# Agencyzoom Integration

AgencyZoom is for the P&C insurance agent that's looking to increase sales, boost retention and analyze agency & producer performance.

**Category**: crm
**Service**: Agencyzoom
**Base URL**: https://api.agencyzoom.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/agencyzoom](https://integrations.do/agencyzoom)

## Installation

```bash
npm install @dotdo/integration-agencyzoom
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-agencyzoom
```

## Quick Start

```typescript
import { AgencyzoomClient } from '@dotdo/integration-agencyzoom'

// Initialize client
const client = new AgencyzoomClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AgencyzoomClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Agencyzoom actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AgencyzoomError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AgencyzoomError) {
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
