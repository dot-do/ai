# Findymail Integration

Findymail is a B2B email and phone data provider offering verified contact information, email verification, automated exports, and CRM enrichment to enhance sales prospecting and outreach efforts.

**Category**: productivity
**Service**: Findymail
**Base URL**: https://api.findymail.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/findymail](https://integrations.do/findymail)

## Installation

```bash
npm install @dotdo/integration-findymail
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-findymail
```

## Quick Start

```typescript
import { FindymailClient } from '@dotdo/integration-findymail'

// Initialize client
const client = new FindymailClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FindymailClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Findymail actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FindymailError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FindymailError) {
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
