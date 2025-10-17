# Aeroleads Integration

AeroLeads is a B2B lead generation platform that helps users find business emails and phone numbers of prospects.

**Category**: productivity
**Service**: Aeroleads
**Base URL**: https://api.aeroleads.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/aeroleads](https://integrations.do/aeroleads)

## Installation

```bash
npm install @dotdo/integration-aeroleads
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-aeroleads
```

## Quick Start

```typescript
import { AeroleadsClient } from '@dotdo/integration-aeroleads'

// Initialize client
const client = new AeroleadsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AeroleadsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Aeroleads actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AeroleadsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AeroleadsError) {
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
