# Leadoku Integration

Leadoku is a platform designed to streamline lead management and sales processes.

**Category**: productivity
**Service**: Leadoku
**Base URL**: https://api.leadoku.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/leadoku](https://integrations.do/leadoku)

## Installation

```bash
npm install @dotdo/integration-leadoku
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-leadoku
```

## Quick Start

```typescript
import { LeadokuClient } from '@dotdo/integration-leadoku'

// Initialize client
const client = new LeadokuClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new LeadokuClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Leadoku actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `LeadokuError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof LeadokuError) {
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
