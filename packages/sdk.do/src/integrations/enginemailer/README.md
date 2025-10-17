# Enginemailer Integration

Enginemailer is an email marketing platform that enables businesses to manage contacts, design campaigns, and send personalized emails.

**Category**: productivity
**Service**: Enginemailer
**Base URL**: https://api.enginemailer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/enginemailer](https://integrations.do/enginemailer)

## Installation

```bash
npm install @dotdo/integration-enginemailer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-enginemailer
```

## Quick Start

```typescript
import { EnginemailerClient } from '@dotdo/integration-enginemailer'

// Initialize client
const client = new EnginemailerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EnginemailerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Enginemailer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EnginemailerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EnginemailerError) {
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
