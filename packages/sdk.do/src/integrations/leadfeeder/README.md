# Leadfeeder Integration

Leadfeeder identifies companies visiting your website and converts them into high-value leads.

**Category**: productivity
**Service**: Leadfeeder
**Base URL**: https://api.leadfeeder.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/leadfeeder](https://integrations.do/leadfeeder)

## Installation

```bash
npm install @dotdo/integration-leadfeeder
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-leadfeeder
```

## Quick Start

```typescript
import { LeadfeederClient } from '@dotdo/integration-leadfeeder'

// Initialize client
const client = new LeadfeederClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LeadfeederClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Leadfeeder actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LeadfeederError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LeadfeederError) {
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
