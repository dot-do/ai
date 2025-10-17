# Fullenrich Integration

FullEnrich is a B2B email and phone waterfall enrichment platform that aggregates contact information from over 15 premium vendors to find the emails and phone numbers of leads.

**Category**: productivity
**Service**: Fullenrich
**Base URL**: https://api.fullenrich.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/fullenrich](https://integrations.do/fullenrich)

## Installation

```bash
npm install @dotdo/integration-fullenrich
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-fullenrich
```

## Quick Start

```typescript
import { FullenrichClient } from '@dotdo/integration-fullenrich'

// Initialize client
const client = new FullenrichClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FullenrichClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Fullenrich actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FullenrichError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FullenrichError) {
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
